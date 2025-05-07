import {
    Service, Logger,
    Config
} from "@cmmv/core";

import {
    Repository, MoreThanOrEqual,
    IsNull, LessThanOrEqual
} from "@cmmv/repository";

//@ts-ignore
import { AIContentService } from "@cmmv/ai-content";

import {
    ParserService
} from "../parser/parser.service";

@Service()
export class RawService {
    private readonly logger = new Logger("RawService");

    constructor(
        private readonly aiContentService: AIContentService,
        private readonly parserService: ParserService
    ) {}

    /**
     * Get raw feed items
     * @param queries The queries to filter the raw feed items
     * @returns The raw feed items
     */
    async getRaws(queries: any) {
        const FeedRawEntity = Repository.getEntity("FeedRawEntity");

        queries.rejected = false;
        queries.pubDate = MoreThanOrEqual(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2));
        queries.postRef = IsNull();
        delete queries.sortBy;
        delete queries.sort;

        const raw = await Repository.findAll(FeedRawEntity, queries, [], {
            order: {
                relevance: "DESC",
                pubDate: "DESC"
            }
        });

        return raw;
    }

    /**
     * Get AI processed raw feed item
     * @param id The ID of the raw feed item
     * @param customContent Optional custom content to process instead of the original
     * @returns The AI processed raw feed item
     */
    async getAIRaw(id: string, customContent?: string) {
        try {
            const language = Config.get("blog.language");
            const FeedRawEntity = Repository.getEntity("FeedRawEntity");
            const raw = await Repository.findOne(FeedRawEntity, {
                id: id
            });

            if (!raw)
                throw new Error(`Raw feed item with ID ${id} not found`);

            const contentToProcess = {
                title: raw.title,
                content: customContent || raw.content,
                category: raw.category
            };

            const prompt = `
            You are a content generator for a news aggregation platform that uses the TipTap editor.

            Please transform the following content by:
            1. Translating it to ${language}
            2. Significantly rewriting and expanding the text (aim for 600-3000 words) to avoid similarity with the original
            3. Removing all references to images, videos, or any content that connects directly to the original source
            4. Adding complementary information to enrich the news item, including background context, analysis, and relevant details
            5. Maintaining the general topic but rephrasing completely
            6. Preserving important links to authors, sources, and reference pages, but adding rel="noindex nofollow" attributes to all links
            7. Organizing content with proper HTML formatting for the TipTap editor:
               - Use <h2> tags for section headings (2-4 sections recommended)
               - Use <p> tags for paragraphs
               - Use <ul> and <li> tags for lists where appropriate
               - Include a concluding paragraph
               - For links, use: <a href="https://example.com" rel="noindex nofollow">text</a>
            8. Suggesting 3-8 relevant tags in Portuguese for categorizing this content

            IMPORTANT:
            - For titles, DO NOT default to number-based formats (like "5 Ways to..." or "10 Tips for...")
            - Only use numbered titles when the content specifically warrants it (such as step-by-step guides or ranked lists)
            - Prefer descriptive, narrative or question-based titles that engage readers without relying on numbers
            - Avoid sensationalist or clickbait headlines

            For titles, use these headline formulas (preferring the non-numbered options):

            1. The "How-To Formula":
            How to [Achieve Desired Outcome] without [Common Pain Point]

            Examples:
            - "How to Lose Weight Without Giving Up Your Favorite Foods"
            - "How to Learn a New Language Without Spending Hours Studying"
            - "How to Start Investing Without Taking Big Risks"

            2. The "Question Formula":
            [Intriguing Question That Promises an Answer]?

            Examples:
            - "Is This the Most Overlooked Feature When Buying a Smartphone?"
            - "Are You Making These Common Skincare Mistakes?"
            - "What's the Secret to Perfect Homemade Pizza Every Time?"

            3. The "Secret Formula":
            The Secret to [Achieving Desired Outcome] That [Target Audience] Don't Know About

            Examples:
            - "The Secret to Flawless Skin That Dermatologists Don't Tell You"
            - "The Secret to Perfect Sourdough Bread That Bakers Won't Share"
            - "The Secret to Finding Cheap Flights That Travel Agents Keep Hidden"

            4. The "Why Formula":
            Why [Common Belief/Practice] Is [Wrong/Ineffective] and What to Do Instead

            Examples:
            - "Why Traditional Dieting Is Flawed and What to Do Instead"
            - "Why Your Coffee Brewing Method Is Ruining Your Morning Cup"
            - "Why Most Home Security Systems Fail When You Need Them Most"

            5. The "Comparison Formula":
            [Product/Method A] vs [Product/Method B]: Which Is Better for [Desired Outcome]

            Examples:
            - "Air Fryers vs Convection Ovens: Which Is Better for Healthy Cooking"
            - "Morning Workouts vs Evening Workouts: Which Is Better for Weight Loss"
            - "Traditional Savings vs Investments: Which Is Better for Building Wealth"

            6. The "Ultimate Guide":
            The Ultimate Guide to [Topic] for [Target Audience]

            Examples:
            - "The Ultimate Guide to Home Automation for Beginners"
            - "The Ultimate Guide to Personal Finance for Young Professionals"
            - "The Ultimate Guide to Photography for Smartphone Users"

            7. The "Warning Formula":
            [Warning Sign] - [Problem] You Need to Address Now

            Examples:
            - "Warning - Your Password Security May Be Compromised Right Now"
            - "Caution - These Kitchen Habits Are Secretly Wasting Your Money"
            - "Alert - The Skincare Ingredient You Need to Stop Using Immediately"

            The title MUST be 100 characters or less, clear, factual, and non-sensationalist, accurately representing the content.

            Here is the content to transform:

            Title: ${contentToProcess.title}

            Category: ${contentToProcess.category || 'General'}

            Content: ${contentToProcess.content}

            Return the transformed content in JSON format with the following fields:
            {
              "title": "translated and rewritten title",
              "content": "HTML-formatted content with proper tags",
              "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
            }

            The suggestedTags should be in Portuguese, relevant to the article topic, and useful for SEO and content categorization. Provide suggestions that would complement the article well. The queryTerms should be effective search terms in Portuguese.
            `;

            const generatedText = await this.aiContentService.generateContent(prompt);

            if (!generatedText)
                throw new Error('No content generated by AI');

            try {
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                const jsonContent = jsonMatch ? jsonMatch[0] : null;

                if (!jsonContent)
                    throw new Error('No JSON content found in AI response');

                const parsedContent = JSON.parse(jsonContent);

                await this.processSuggestedImages(parsedContent);

                if (parsedContent.title && parsedContent.title.length > 100) {
                    parsedContent.title = parsedContent.title.substring(0, 97) + '...';
                    this.logger.log(`Title was truncated to 100 characters for raw feed item ${id}`);
                }

                return {
                    ...raw,
                    originalTitle: raw.title,
                    originalContent: raw.content,
                    title: parsedContent.title,
                    content: parsedContent.content,
                    suggestedImages: parsedContent.suggestedImages || [],
                    suggestedTags: parsedContent.suggestedTags || [],
                    aiProcessed: true,
                    processedAt: new Date()
                };
            } catch (parseError) {
                this.logger.error(`Failed to parse AI generated content: ${parseError}`);
                throw new Error('Failed to parse AI generated content');
            }

        } catch (error: unknown) {
            this.logger.error(`Error in getAIRaw: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    /**
     * Process suggested images by finding actual image URLs
     * @param parsedContent The content with suggested image queries
     */
    private async processSuggestedImages(parsedContent: any) {
        try {
            if (!parsedContent.suggestedImages || !Array.isArray(parsedContent.suggestedImages)) {
                parsedContent.suggestedImages = [];
                return;
            }

            for (const suggestion of parsedContent.suggestedImages) {
                if (!suggestion.queryTerms) continue;

                try {
                    suggestion.imageUrls = await this.findImageUrls(suggestion.queryTerms);
                } catch (imgError) {
                    this.logger.log(`Failed to find images for query "${suggestion.queryTerms}": ${imgError}`);
                    suggestion.imageUrls = [];
                }
            }

            parsedContent.suggestedImages = parsedContent.suggestedImages.filter(
                (suggestion: any) => suggestion.imageUrls && suggestion.imageUrls.length > 0
            );
        } catch (error) {
            this.logger.error(`Error processing image suggestions: ${error}`);
            parsedContent.suggestedImages = [];
        }
    }

    /**
     * Find image URLs based on search terms
     * @param query Search terms to find images
     * @returns Array of image URLs
     */
    private async findImageUrls(query: string): Promise<string[]> {
        try {
            const searchTerms = encodeURIComponent(query.trim().toLowerCase());
            const imageUrls = [];

            if (searchTerms.includes('tecnologia') || searchTerms.includes('tech')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dGVjaG5vbG9neXxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dGVjaHxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080'
                );
            } else if (searchTerms.includes('negocio') || searchTerms.includes('business') || searchTerms.includes('empresa')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YnVzaW5lc3N8ZW58MHx8fHwxNjE0MDI4OTU2&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1664575602554-2087b04935d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fGJ1c2luZXNzfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080'
                );
            } else if (searchTerms.includes('politica') || searchTerms.includes('political') || searchTerms.includes('governo')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cG9saXRpY3N8ZW58MHx8fHwxNjE0MDI4OTU2&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1575320181282-9afab399332c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Z292ZXJubWVudHxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cG9saXRpY3N8ZW58MHx8fHwxNjE0MDI4OTU2&ixlib=rb-4.0.3&q=80&w=1080'
                );
            } else if (searchTerms.includes('ciencia') || searchTerms.includes('science')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2NpZW5jZXxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8c2NpZW5jZXxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1518152006812-edab29b069ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8c2NpZW5jZXxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080'
                );
            } else if (searchTerms.includes('saude') || searchTerms.includes('health') || searchTerms.includes('medicina')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8aGVhbHRofGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bWVkaWNhbHxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fGhlYWx0aHxlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080'
                );
            } else if (searchTerms.includes('esporte') || searchTerms.includes('sport')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3BvcnRzfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c3BvcnRzfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHNwb3J0c3xlbnwwfHx8fDE2MTQwMjg5NTY&ixlib=rb-4.0.3&q=80&w=1080'
                );
            } else if (searchTerms.includes('arte') || searchTerms.includes('art')) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YXJ0fGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YXJ0fGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YXJ0fGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080'
                );
            }

            if (imageUrls.length === 0) {
                imageUrls.push(
                    'https://images.unsplash.com/photo-1493612276216-ee3925520721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cmFuZG9tfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1481277542470-605612bd2d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080'
                );
            }

            this.logger.log(`Found ${imageUrls.length} images for query "${query}"`);

            return imageUrls;
        } catch (error) {
            this.logger.error(`Error finding images for query "${query}": ${error}`);

            return [
                'https://images.unsplash.com/photo-1493612276216-ee3925520721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cmFuZG9tfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080',
                'https://images.unsplash.com/photo-1481277542470-605612bd2d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fHx8MTYxNDAyODk1Ng&ixlib=rb-4.0.3&q=80&w=1080'
            ];
        }
    }

    /**
     * Update a raw feed item
     * @param id The ID of the raw feed item
     * @param data The data to update the raw feed item with
     * @returns The updated raw feed item
     */
    async updateRaw(id: string, data: any) {
        const FeedRawEntity = Repository.getEntity("FeedRawEntity");
        const raw = await Repository.findOne(FeedRawEntity, {
            id: id
        });
        let updatedRaw = null;
        let updateData: any = {};

        if(data.postRef) {
            updateData.postRef = data.postRef;
        }

        if(data.rejected) {
            updateData.rejected = data.rejected;
        }

        if(data.featureImage)
            updateData.featureImage = data.featureImage;

        if (!raw)
            throw new Error(`Raw feed item with ID ${id} not found`);

        updatedRaw = await Repository.update(FeedRawEntity, {
            id: id
        }, updateData);

        return {
            message: "Raw feed item updated successfully"
        };
    }

    /**
     * Reject a raw feed item
     * @param id The ID of the raw feed item
     * @returns The rejected raw feed item
     */
    async rejectRaw(id: string) {
        const FeedRawEntity = Repository.getEntity("FeedRawEntity");
        const raw = await Repository.findOne(FeedRawEntity, {
            id: id
        });

        if (!raw)
            throw new Error(`Raw feed item with ID ${id} not found`);

        await Repository.updateOne(FeedRawEntity, Repository.queryBuilder({
            id: id
        }), { rejected: true });

        return {
            message: "Raw feed item rejected successfully"
        };
    }

    /**
     * Proxy image
     * @param imageUrl The URL of the image to proxy
     * @param res The response object
     * @returns The image
     */
    async proxyImage(imageUrl: string, res: any): Promise<any> {
        try {
            if (!imageUrl || typeof imageUrl !== 'string') {
                res.status(400).json({ error: 'URL inválida' });
                return;
            }

            const response = await fetch(imageUrl, {
                method: 'get',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!response.ok)
                throw new Error(`Error fetching image: ${response.status} ${response.statusText}`);

            const contentType = response.headers.get('content-type');
            res.setHeader('Content-Type', contentType || 'image/jpeg');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=86400');

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            res.send(buffer);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar imagem' });
        }
    }

    /**
     * Clean all raw feed items that are older than a specified period
     * @returns Information about the cleaning operation
     */
    async cleanAllRaws(): Promise<any> {
        try {
            const FeedRawEntity = Repository.getEntity("FeedRawEntity");
            const deleteResult = await Repository.delete(FeedRawEntity, {});

            return {
                success: true,
                message: `Successfully cleaned raw feed items`,
                deletedCount: deleteResult || 0
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error cleaning raw feed items: ${errorMessage}`);
            throw new Error(`Failed to clean raw feed items: ${errorMessage}`);
        }
    }

    /**
     * Clean raw feed items for a specific channel that are older than a specified period
     * @param channelId The ID of the channel to clean raw items for
     * @returns Information about the cleaning operation
     */
    async cleanChannelRaws(channelId: string): Promise<any> {
        try {
            if (!channelId) {
                throw new Error("Channel ID is required");
            }

            const FeedRawEntity = Repository.getEntity("FeedRawEntity");

            const deleteResult = await Repository.delete(
                FeedRawEntity,
                Repository.queryBuilder({
                    channel: channelId
                })
            );

            return {
                success: true,
                message: `Successfully cleaned raw feed items for channel ${channelId}`,
                channelId: channelId,
                deletedCount: deleteResult || 0
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error cleaning raw feed items for channel: ${errorMessage}`);
            throw new Error(`Failed to clean raw feed items for channel: ${errorMessage}`);
        }
    }

    /**
     * Reprocess a raw feed item using the parser
     * @param id The ID of the raw feed item to reprocess
     * @returns A success message or an error
     */
    async reprocessRaw(id: string): Promise<any> {
        try {
            const FeedRawEntity = Repository.getEntity("FeedRawEntity");
            const FeedChannelsEntity = Repository.getEntity("FeedChannelsEntity");

            const raw = await Repository.findOne(FeedRawEntity, {
                id: id
            });

            if (!raw)
                throw new Error(`Raw feed item with ID ${id} not found`);

            const channel = await Repository.findOne(FeedChannelsEntity, {
                id: raw.channel
            });

            if (!channel)
                throw new Error(`Channel with ID ${raw.channel} not found`);

            if (!raw.link)
                throw new Error(`Raw feed item with ID ${id} has no link`);

            try {
                const parseResult = await this.parserService.parseContent(null, raw.link);

                if (!parseResult || !parseResult.success || !parseResult.data) {
                    throw new Error(`Failed to parse content from ${raw.link}`);
                }

                const data = parseResult.data;

                const updateData: any = {
                    updatedAt: new Date()
                };

                if (data.title) updateData.title = data.title;
                if (data.content) updateData.content = data.content;
                if (data.featureImage) updateData.featureImage = data.featureImage;

                await Repository.updateOne(FeedRawEntity, Repository.queryBuilder({ id: id }), updateData);

                return {
                    success: true,
                    message: "Raw feed item reprocessed successfully"
                };
            } catch (parseError) {
                this.logger.error(`Error parsing content from ${raw.link}: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
                throw new Error(`Failed to parse content: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
            }
        } catch (error: unknown) {
            this.logger.error(`Error reprocessing raw feed item: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    /**
     * Automatically classify raw feed items based on game development relevance using AI
     * @returns Information about the classification operation
     */
    async classifyRawsWithAI() {
        try {
            const classifyPrompt = Config.get("blog.classifyPrompt");
            const FeedRawEntity = Repository.getEntity("FeedRawEntity");
            this.logger.log("Starting AI classification of raw feed items...");

            const rawItemsResponse = await Repository.findAll(FeedRawEntity, {
                rejected: false,
                relevance: 0,
                postRef: IsNull(),
                limit: 20,
                sortBy: "pubDate",
                sort: "DESC"
            });

            if (!rawItemsResponse || rawItemsResponse.data.length === 0) {
                this.logger.log("No unclassified raw items found for AI classification");
                return;
            }
            else{
                this.logger.log(`Found ${rawItemsResponse.data.length} unclassified raw items for AI classification`);
            }

            const rawItems = rawItemsResponse.data;

            const itemsForAI = rawItems.map((item: any) => ({
                id: item.id,
                title: item.title
            }));

            const prompt = `
            You are a content classification system for a news aggregation blog.

            I'll provide you with a list of article titles, descriptions, and categories from various sources.

            Your task is to classify each article based on its relevance to:

            IMPORTANT: You must return ONLY a valid JSON array with no additional text or explanation.
            Each item in the array should contain:
            - id: the original ID
            - relevance: a score from 1-100 indicating relevance to game development (higher = more relevant)
            - rejected: true if completely unrelated to gaming or game development, false otherwise

            ${classifyPrompt}

            Here are the items to classify:
            ${JSON.stringify(itemsForAI)}
            `;

            this.logger.log("Sending classification request to AI service");
            const aiResponse = await this.aiContentService.generateContent(prompt);

            if (!aiResponse)
                throw new Error("No response received from AI classification service");

            let classificationResults;

            try {
                try {
                    classificationResults = JSON.parse(aiResponse.trim());
                } catch (directParseError) {
                    const jsonMatch = aiResponse.match(/\[\s*\{.*\}\s*\]/s);

                    if (!jsonMatch)
                        throw new Error("No valid JSON array found in AI response");

                    classificationResults = JSON.parse(jsonMatch[0]);
                }

                if (!Array.isArray(classificationResults))
                    throw new Error("AI response is not an array");

                classificationResults.forEach((result, index) => {
                    if (!result.id)
                        throw new Error(`Result at index ${index} is missing id field`);

                    if (typeof result.relevance !== 'number')
                        throw new Error(`Result at index ${index} has invalid relevance value`);

                    if (typeof result.rejected !== 'boolean')
                        throw new Error(`Result at index ${index} has invalid rejected value`);
                });

                this.logger.log(`Successfully parsed ${classificationResults.length} classification results`);
            } catch (parseError) {
                this.logger.error(`Failed to parse AI classification response: ${parseError}`);
                this.logger.error(`AI response was: ${aiResponse.substring(0, 500)}...`);
                throw new Error(`Failed to parse AI classification response: ${parseError}`);
            }

            let rejectedCount = 0;
            let classifiedCount = 0;
            let errorCount = 0;

            for (const result of classificationResults) {
                try {
                    const id = result.id;
                    const relevance = result.relevance;
                    const rejected = result.rejected;

                    // Validate item exists in database
                    const rawItem = await Repository.findOne(FeedRawEntity, { id });
                    if (!rawItem) {
                        this.logger.log(`Raw item with ID ${id} not found, skipping`);
                        errorCount++;
                        continue;
                    }

                    // Update the raw feed item
                    const updateData: any = {
                        relevance: relevance
                    };

                    if (rejected) {
                        updateData.rejected = true;
                        rejectedCount++;
                    } else {
                        classifiedCount++;
                    }

                    await Repository.updateOne(FeedRawEntity, Repository.queryBuilder({ id }), updateData);
                    this.logger.log(`Updated raw item ${result.id} with relevance ${result.relevance} and rejected=${result.rejected}`);
                } catch (updateError) {
                    this.logger.error(`Error updating raw item ${result.id}: ${updateError}`);
                    errorCount++;
                }
            }

            return {
                success: true,
                message: "Raw feed items classified successfully",
                total: rawItems.length,
                classified: classifiedCount,
                rejected: rejectedCount,
                errors: errorCount
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error classifying raw feed items: ${errorMessage}`);
            throw new Error(`Failed to classify raw feed items: ${errorMessage}`);
        }
    }

    /**
     * Get raw feed items sorted by relevance
     * @param queries The queries to filter the raw feed items
     * @returns The raw feed items sorted by relevance
     */
    async getRelevantRaws(queries: any) {
        const FeedRawEntity = Repository.getEntity("FeedRawEntity");

        queries.rejected = false;
        queries.postRef = IsNull();

        const raw = await Repository.findAll(FeedRawEntity, queries, [], {
            order: {
                relevance: "DESC",
                pubDate: "DESC"
            }
        });

        return raw;
    }
}
