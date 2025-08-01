import {
    Service, Application, Config, Logger
} from "@cmmv/core";

import {
    Repository, In, Not, IsNull,
    MoreThan
} from "@cmmv/repository";

//@ts-ignore
import { AIContentService } from "@cmmv/ai-content";
import { DeeplinkService } from "../deeplink/deeplink.service";
//@ts-ignore
import { ShortUrlServiceTools } from "@cmmv/blog";

interface PostJob {
    id: string;
    campaignId: string;
    type: 'post';
    status: 'pending' | 'processing' | 'completed' | 'error';
    result?: any;
    error?: string;
    startTime: Date;
}

@Service()
export class CouponsServiceTools {
    private readonly logger = new Logger("CouponsService");
    private postJobs: Map<string, PostJob> = new Map();

    constructor(
        private readonly aiContentService: AIContentService,
        private readonly shortUrlService: ShortUrlServiceTools
    ) {}

    /**
     * Uses AI to search for coupon codes for a specific campaign and adds them to the database
     * @param campaignId The ID of the campaign to find coupons for
     * @returns Array of created coupon objects
     */
    async getCouponsWithAI(campaignId: string) {
        const language = Config.get("blog.language", "en");
        const deeplinkService = Application.resolveProvider(DeeplinkService);
        const AffiliateCampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const AffiliateCampaignsNetworksEntity = Repository.getEntity("AffiliateCampaignsNetworksEntity");
        const AffiliateAccountsEntity = Repository.getEntity("AffiliateAccountsEntity");

        const campaign = await Repository.findOne(AffiliateCampaignsEntity, {
            id: campaignId
        });

        if (!campaign)
            throw new Error(`Campaign with ID ${campaignId} not found`);

        const campaignNetwork = await Repository.findOne(AffiliateCampaignsNetworksEntity, {
            domain: campaign.domain
        });

        if (!campaignNetwork)
            throw new Error(`Campaign with ID ${campaignId} not found network account`);

        const account = await Repository.findOne(AffiliateAccountsEntity, {
            network: campaignNetwork.network
        });

        if (!account)
            throw new Error(`Account with ID ${campaignNetwork.accountId} not found`);

        const prompt = `
            Find 10 current discount coupon codes for ${campaign.name} by searching these specific coupon websites:
            - https://www.1001cupomdedescontos.com.br/
            - https://thiagorodrigo.com.br/
            - https://www.cuponation.com.br/
            - https://www.picodi.com/br/
            - https://www.cuponomia.com.br/

            Search these sites for ${campaign.name} coupons and only include coupons that have an actual code and are VALID (not expired).
            IMPORTANT: Only include coupons with expiration dates in the future (after today's date) or with no expiration.

            For each coupon, provide:
            1. Translating it to ${language}
            2. The coupon code
            3. A brief description of the discount (make it detailed but do not exceed 250 characters)
            4. The expiration date (if available) - MUST be after today or null
            5. The discount amount or percentage
            6. The source URL from one of the coupon sites above where you found this coupon code
            7. I only want coupons that point to the domain ${campaign.domain}
            8. Do not invent links that do not exist, as this will cause problems in generating deeplinks.
            9. If you cannot find a valid link, use the home link when returning from the registry.
            10. Check the coupon websites above for ${campaign.name} coupons and verify they are current and working.

            IMPORTANT: Return ONLY a raw JSON array with objects containing these fields, without any explanation or text before or after:
            [
              {
                "code": "EXAMPLE15",
                "description": "Description of the discount - make this detailed with 100-250 characters explaining the offer, restrictions, and benefits",
                "expiration": "YYYY-MM-DD",
                "type": "Cupom",
                "typeDiscount": "percentage" or "fixed",
                "title": "Brief title for the coupon",
                "linkRef": "https://example.com/source-page-where-coupon-was-found"
              }
            ]

            If the expiration date is not available, set it to null.
            For typeDiscount, set to "percentage" if it's a percentage discount, or "fixed" if it's a fixed amount.
            For linkRef, provide the EXACT URL from one of the coupon websites above where you found the coupon code - this is very important.
            Today's date is ${new Date().toISOString().split('T')[0]}, so all expiration dates must be after this date.

            DO NOT include any explanatory text, disclaimers or notes - ONLY the JSON array.
        `;

        try {
            const aiService = Application.resolveProvider<any>(AIContentService);

            let generatedText;
            let lastError;
            const maxRetries = 3;
            const retryDelay = 5000;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    generatedText = await aiService.generateContent(prompt);

                    if (generatedText) {
                        break;
                    } else {
                        throw new Error('Empty response from AI service');
                    }
                } catch (error: any) {
                    lastError = error;

                    const isTimeoutError = error.message?.includes('timeout') ||
                                         error.message?.includes('Timeout') ||
                                         error.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                                         error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT';

                    const isConnectionError = error.message?.includes('fetch failed') ||
                                            error.message?.includes('connect') ||
                                            error.message?.includes('ECONNREFUSED');

                    if (attempt === maxRetries || (!isTimeoutError && !isConnectionError))
                        break;

                    if (attempt < maxRetries)
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }

            if (!generatedText)
                throw new Error(`Failed to generate content after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);

            let coupons = [];

            let jsonText = '';
            if (typeof generatedText === 'string') {
                const jsonStartIndex = generatedText.indexOf('[');
                const jsonEndIndex = generatedText.lastIndexOf(']') + 1;

                if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
                    jsonText = generatedText.substring(jsonStartIndex, jsonEndIndex);
                } else {
                    jsonText = generatedText;
                }

                jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
            } else {
                jsonText = JSON.stringify(generatedText);
            }

            const parsedResponse = JSON.parse(jsonText);

            if (Array.isArray(parsedResponse)) {
                coupons = parsedResponse;
            } else if (parsedResponse.coupons && Array.isArray(parsedResponse.coupons)) {
                coupons = parsedResponse.coupons;
            } else {
                console.warn("AI response does not contain a valid coupons array");
                return [];
            }

            const savedCoupons = [];
            for (const coupon of coupons) {
                if (!coupon.code) continue;

                const existingCoupon = await Repository.findOne(AffiliateCouponsEntity, {
                    code: coupon.code
                });

                if (existingCoupon)
                    continue;

                const deeplink = await deeplinkService.getDeeplink(account.id, campaignNetwork.id, coupon.linkRef);
                const shortUrl = await this.shortUrlService.createShortUrl(deeplink.deeplink);

                const newCoupon = {
                    title: coupon.title || `${campaign.name} ${coupon.code}`,
                    description: coupon.description || '',
                    code: coupon.code,
                    expiration: coupon.expiration ? new Date(coupon.expiration) : null,
                    type: coupon.type || 'Cupom',
                    typeDiscount: coupon.typeDiscount || 'percentage',
                    active: true,
                    campaign: campaignId,
                    campaignName: campaign.name,
                    network: campaign.network || null,
                    linkRef: coupon.linkRef || null,
                    deeplink: deeplink.deeplink,
                    shortUrl: shortUrl
                };

                try {
                    const savedCoupon = await Repository.insert(AffiliateCouponsEntity, newCoupon);
                    savedCoupons.push(savedCoupon);
                } catch (err) {
                    console.warn(`Failed to save coupon ${coupon.code}: ${err instanceof Error ? err.message : String(err)}`);
                }
            }

            if (savedCoupons.length > 0) {
                try {
                    const totalCouponsResponse = await this.getCouponsCountByCampaignId(campaignId);
                    const totalCoupons = totalCouponsResponse?.count || 0;

                    await Repository.update(AffiliateCampaignsEntity, { id: campaignId }, {
                        coupons: totalCoupons
                    });
                } catch (updateError: any) {}
            }

            return savedCoupons;
        } catch (err) {
            console.warn(`Error processing AI response: ${err instanceof Error ? err.message : String(err)}`);
            return [];
        }
    }

    /**
     * Get all coupons for a campaign
     * @param campaignId The ID of the campaign to get coupons for
     * @returns Array of coupon objects
     */
    async getCoupons(campaignId: string) {
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");

        const coupons = await Repository.findAll(AffiliateCouponsEntity, {
            limit: 50,
            active: true,
            campaign: campaignId,
            deeplink: Not(IsNull()),
            link: Not(IsNull()),
        }, [], {
            order: {
                expiration: "DESC"
            },
            select: [
                "title", "code", "description", "expiration", "type", "typeDiscount",
                "linkRef", "deeplink", "views", "shortUrl"
            ]
        });

        return (coupons) ? coupons.data : [];
    }

    /**
     * Get the count of active coupons for a campaign
     * @param campaignId The ID of the campaign to get coupons for
     * @returns The count of coupons
     */
    async getCouponsCountByCampaignId(campaignId: string) {
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");

        const count = await Repository.count(AffiliateCouponsEntity, {
            active: true,
            campaign: campaignId,
            deeplink: Not(IsNull()),
            link: Not(IsNull()),
        });

        return { count: count || 0 };
    }

    /**
     * Get all coupons for a campaign with views
     * @param campaignId The ID of the campaign to get coupons for
     * @returns Array of coupon objects
     */
    async getCouponsWithViews() {
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const AffiliateCampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

        const coupons = await Repository.findAll(AffiliateCouponsEntity, {
            limit: 10000,
            active: true,
            campaign: Not(IsNull()),
            expiration: MoreThan(new Date()),
            deeplink: Not(IsNull()),
            link: Not(IsNull()),
        }, [], {
            order: {
                views: "DESC"
            },
            select: [
                "title", "code", "description", "expiration", "type", "typeDiscount",
                "views", "campaign", "deeplink", "shortUrl"
            ]
        });

        const campaignIds = (coupons) ? coupons.data.map((coupon: any) => coupon.campaign) : [];

        const campaigns = await Repository.findAll(AffiliateCampaignsEntity, {
            id: In(campaignIds)
        }, [], {
            select: ["id", "name", "slug", "logo"]
        });

        if (!campaigns)
            throw new Error(`Campaigns with IDs ${campaignIds} not found`);

        const campaignMap = new Map(campaigns.data.map((campaign: any) => [campaign.id, campaign]));
        let dataResponse: any[] = [];

        if (coupons && coupons.data) {
            dataResponse = coupons.data.map((coupon: any) => {
                if (coupon.campaign && typeof coupon.campaign === 'string' && coupon.campaign.trim() !== '') {
                    const campaignDetails: any = campaignMap.get(coupon.campaign);
                    if (campaignDetails) {
                        return {
                            ...coupon,
                            campaignName: campaignDetails.name,
                            campaignSlug: campaignDetails.slug,
                            campaignLogo: campaignDetails.logo
                        };
                    }
                }
                return null;
            }).filter((coupon: any) => coupon !== null && coupon.campaignName && coupon.campaignName !== 'N/A');
        }

        return (dataResponse.length > 0) ? dataResponse : [];
    }

    /**
     * Get the top 25 weekly coupons based on views
     * @returns Array of top 25 coupon objects
     */
    async getTop25WeeklyCoupons() {
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const AffiliateCampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

        const couponsResult = await Repository.findAll(AffiliateCouponsEntity, {
            active: true,
            campaign: Not(IsNull()),
            expiration: MoreThan(new Date()),
            deeplink: Not(IsNull()),
            link: Not(IsNull()),
            type: "Cupom",
            limit: 50
        },
        [], // relations
        {
            order: {
                views: "DESC"
            },
            select: [
                "title", "code", "description", "expiration", "type", "typeDiscount",
                "views", "campaign", "linkRef", "deeplink", "shortUrl"
            ]
        });

        if (!couponsResult || !couponsResult.data || couponsResult.data.length === 0) {
            return [];
        }

        const campaignIds = couponsResult.data.map((coupon: any) => coupon.campaign);

        const campaigns = await Repository.findAll(AffiliateCampaignsEntity, {
            id: In(campaignIds),
            limit: 10000
        }, [], {
            select: ["id", "name", "slug", "logo"]
        });

        if (!campaigns || !campaigns.data)
            console.warn(`Not all campaigns with IDs ${campaignIds} were found`);

        const campaignMap = new Map(campaigns && campaigns.data ? campaigns.data.map((campaign: any) => [campaign.id, campaign]) : []);

        let processedCoupons: any[] = [];

        processedCoupons = couponsResult.data.map((coupon: any) => {
            if (coupon.campaign && typeof coupon.campaign === 'string' && coupon.campaign.trim() !== '') {
                const campaignDetails: any = campaignMap.get(coupon.campaign);
                if (campaignDetails) {
                    return {
                        ...coupon,
                        campaignName: campaignDetails.name,
                        campaignSlug: campaignDetails.slug,
                        campaignLogo: campaignDetails.logo
                    };
                } else {
                    return {
                        ...coupon,
                        campaignName: "N/A",
                        campaignSlug: "",
                        campaignLogo: ""
                    };
                }
            }
            return null;
        }).filter((coupon: any) => coupon !== null);


        if (processedCoupons.length === 0)
            return [];

        const campaignCouponsMap = new Map<string, any[]>();
        for (const coupon of processedCoupons) {
            const campaignId = coupon.campaign;
            if (campaignId) {
                if (!campaignCouponsMap.has(campaignId)) {
                    campaignCouponsMap.set(campaignId, []);
                }
                campaignCouponsMap.get(campaignId)!.push(coupon);
            }
        }

        if (campaignCouponsMap.size === 0)
            return [];

        const finalTop25Coupons: any[] = [];
        const uniqueCampaignIds = Array.from(campaignCouponsMap.keys());
        const campaignNextCouponIndex = new Map<string, number>();
        uniqueCampaignIds.forEach(id => campaignNextCouponIndex.set(id, 0));

        while (finalTop25Coupons.length < 25) {
            let addedACouponThisRound = false;
            for (const campaignId of uniqueCampaignIds) {
                const couponsFromThisCampaign = campaignCouponsMap.get(campaignId)!;
                const nextIndex = campaignNextCouponIndex.get(campaignId)!;

                if (nextIndex < couponsFromThisCampaign.length) {
                    finalTop25Coupons.push(couponsFromThisCampaign[nextIndex]);
                    campaignNextCouponIndex.set(campaignId, nextIndex + 1);
                    addedACouponThisRound = true;
                    if (finalTop25Coupons.length === 25) {
                        break;
                    }
                }
            }
            if (!addedACouponThisRound) {
                break;
            }
        }

        return finalTop25Coupons;
    }

    /**
     * Generate AI content about the best coupons of the month for a campaign
     * @param campaignId The ID of the campaign to generate content for
     * @returns AI generated content about the best coupons
     */
    async generateBestCouponsPost(campaignId: string) {
        const language = Config.get("blog.language", "en");
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const AffiliateCampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

        const campaign = await Repository.findOne(AffiliateCampaignsEntity, {
            id: campaignId
        });

        if (!campaign)
            throw new Error(`Campaign with ID ${campaignId} not found`);

        const couponsResult = await Repository.findAll(AffiliateCouponsEntity, {
            deeplink: Not(IsNull()),
            link: Not(IsNull()),
            campaign: campaignId,
            active: true,
            limit: 20
        }, [], {
            order: {
                createdAt: "DESC"
            },
            select: [
                "title", "code", "description", "expiration",
                "type", "typeDiscount", "views", "shortUrl"
            ]
        });

        if (!couponsResult || !couponsResult.data || couponsResult.data.length === 0) {
            throw new Error(`No active coupons found for campaign ${campaign.name}`);
        }

        const coupons = couponsResult.data;
        const currentMonth = new Date().toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
            month: 'long',
            year: 'numeric'
        });

        // Prepare coupons data for AI
        const couponsData = coupons.map((coupon: any) => ({
            title: coupon.title,
            code: coupon.code,
            description: coupon.description,
            type: coupon.type,
            typeDiscount: coupon.typeDiscount,
            expiration: coupon.expiration ? new Date(coupon.expiration).toLocaleDateString() : 'No expiration',
            views: coupon.views || 0
        }));

        const prompt = `
        You are a content generator for a coupon and discount website that uses the TipTap editor.

        Please create an engaging blog post about the best discount coupons for ${campaign.name} for ${currentMonth}.

        Transform the following coupon data into a comprehensive article by:
        1. Writing in ${language} language
        2. Creating an engaging title focused on SEO (maximum 100 characters)
        3. Writing HTML-formatted content with proper tags (h2, h3, p, ul, li, etc.)
        4. Highlighting the best deals and savings opportunities
        5. Including tips on how to use the coupons effectively
        6. Adding SEO-focused content about shopping at ${campaign.name}
        7. Mentioning seasonal opportunities and urgency when appropriate

        Here are the available coupons for ${campaign.name}:
        ${JSON.stringify(couponsData, null, 2)}

        Campaign details:
        - Store name: ${campaign.name}
        - Domain: ${campaign.domain || 'N/A'}
        - Description: ${campaign.description || 'N/A'}

        IMPORTANT:
        - DO NOT write any conclusion or summary paragraph. The article should feel unfinished and open-ended.
        - It should not wrap up the discussion or provide closing thoughts.
        - Avoid phrases like "In conclusion," "To summarize," "Finally," or any language that suggests the article is ending.
        - Focus on encouraging readers to take action and use the coupons
        - Include practical tips and benefits of shopping at ${campaign.name}
        - Make the content SEO-friendly with relevant keywords

        Return the content in JSON format with the following fields:
        {
          "title": "SEO optimized title about best ${campaign.name} coupons for ${currentMonth}",
          "content": "HTML-formatted content with proper tags",
          "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
          "suggestedCategories": ["categoryName1", "categoryName2"]
        }`;

        try {
            const aiService = Application.resolveProvider<any>(AIContentService);

            let generatedText;
            let lastError;
            const maxRetries = 3;
            const retryDelay = 5000;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    generatedText = await aiService.generateContent(prompt);

                    if (generatedText) {
                        break;
                    } else {
                        throw new Error('Empty response from AI service');
                    }
                } catch (error: any) {
                    lastError = error;

                    const isTimeoutError = error.message?.includes('timeout') ||
                                         error.message?.includes('Timeout') ||
                                         error.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                                         error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT';

                    const isConnectionError = error.message?.includes('fetch failed') ||
                                            error.message?.includes('connect') ||
                                            error.message?.includes('ECONNREFUSED');

                    if (attempt === maxRetries || (!isTimeoutError && !isConnectionError))
                        break;

                    if (attempt < maxRetries)
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }

            if (!generatedText)
                throw new Error(`Failed to generate content after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);

            let parsedContent;
            try {
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                const jsonContent = jsonMatch ? jsonMatch[0] : null;

                if (!jsonContent)
                    throw new Error('No JSON content found in AI response');

                parsedContent = JSON.parse(jsonContent);

                if (parsedContent.title && parsedContent.title.length > 100)
                    parsedContent.title = parsedContent.title.substring(0, 97) + '...';
            } catch (parseError) {
                throw new Error('Failed to parse AI generated content');
            }

            const continuationPrompt = `
            You are a content generator for a coupon and discount website that uses the TipTap editor.

            I've already generated part of the content about ${campaign.name} coupons, but I need you to continue this article with more SEO-focused content, shopping tips, and additional value for readers.

            Please continue from where this left off, adding:
            1. More detailed shopping tips and strategies
            2. Information about ${campaign.name} as a store
            3. Best times to shop and save
            4. How to stack coupons or combine with other offers
            5. SEO-friendly content about discount shopping
            6. Additional benefits of shopping at ${campaign.name}

            Original content generated:
            ${parsedContent.content}

            Continue writing in ${language} language and maintain the same style and flow.
            Your continuation should be substantial and add real value to readers.

            IMPORTANT:
            - DO NOT write any conclusion or summary paragraph. The article should feel unfinished and open-ended.
            - It should not wrap up the discussion or provide closing thoughts.
            - Avoid phrases like "In conclusion," "To summarize," "Finally," or any language that suggests the article is ending.
            - Focus on providing more actionable tips and insights

            Return only the continuation in JSON format with the following field:
            {
              "continuation": "HTML-formatted content with proper tags that continues the existing text"
            }
            `;

            // Retry logic for continuation AI service call
            let continuationText;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    continuationText = await aiService.generateContent(continuationPrompt);

                    if (continuationText)
                        break;
                } catch (error: any) {
                    const isTimeoutError = error.message?.includes('timeout') ||
                                         error.message?.includes('Timeout') ||
                                         error.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                                         error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT';

                    const isConnectionError = error.message?.includes('fetch failed') ||
                                            error.message?.includes('connect') ||
                                            error.message?.includes('ECONNREFUSED');

                    if (attempt === maxRetries || (!isTimeoutError && !isConnectionError))
                        break;

                    if (attempt < maxRetries)
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }

            if (continuationText) {
                try {
                    const continuationJsonMatch = continuationText.match(/\{[\s\S]*\}/);
                    const continuationJsonContent = continuationJsonMatch ? continuationJsonMatch[0] : null;

                    if (continuationJsonContent) {
                        const parsedContinuation = JSON.parse(continuationJsonContent);

                        if (parsedContinuation.continuation) {
                            const lastClosingTagMatch = parsedContent.content.match(/<\/[^>]+>$/);

                            if (lastClosingTagMatch) {
                                const insertPosition = parsedContent.content.lastIndexOf(lastClosingTagMatch[0]);
                                parsedContent.content =
                                    parsedContent.content.substring(0, insertPosition) +
                                    parsedContinuation.continuation +
                                    parsedContent.content.substring(insertPosition);
                            } else {
                                parsedContent.content += parsedContinuation.continuation;
                            }
                        }
                    }
                } catch (continuationError) {}
            }

            let coverImage = null;

            try {
                const searchKeywords = [
                    campaign.name.toLowerCase(),
                    'discount', 'coupon', 'sale', 'shopping',
                    'deals', 'offers', 'savings'
                ];
                if (campaign.description) {
                    const descWords = campaign.description.toLowerCase()
                        .split(' ')
                        .filter((word: string) => word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word))
                        .slice(0, 3);
                    searchKeywords.push(...descWords);
                }

                if (parsedContent.title) {
                    const titleWords = parsedContent.title.toLowerCase()
                        .replace(/[^\w\s]/g, '')
                        .split(' ')
                        .filter((word: string) => word.length > 3 && !['cupons', 'desconto', 'ofertas', 'melhores'].includes(word))
                        .slice(0, 2);
                    searchKeywords.push(...titleWords);
                }

                const searchQueries = [
                    `${campaign.name} shopping discount`,
                    `${campaign.name} sale offers`,
                    'shopping cart discount coupon',
                    'online shopping deals',
                    'discount shopping bag',
                    'sale promotion banner'
                ];

                coverImage = await this.searchCoverImage(searchQueries);

                if (!coverImage)
                    coverImage = campaign.logo || null;
            } catch (imageError) {
                coverImage = campaign.logo || null;
            }

            return {
                success: true,
                data: {
                    title: parsedContent.title,
                    content: parsedContent.content,
                    suggestedTags: parsedContent.suggestedTags || [],
                    suggestedCategories: parsedContent.suggestedCategories || [],
                    campaignName: campaign.name,
                    campaignDomain: campaign.domain,
                    couponsCount: coupons.length,
                    generatedAt: new Date(),
                    month: currentMonth,
                    coverImage: coverImage
                }
            };

        } catch (error: any) {
            throw new Error(`Failed to generate content: ${error.message}`);
        }
    }

    /**
     * Export the coupons
     * @returns The coupons
     */
    async export(){
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const coupons = await Repository.findAll(AffiliateCouponsEntity, { limit: 1000000 });
        return (coupons && coupons.data.length > 0) ? JSON.stringify(coupons.data, null, 4) : "";
    }

    /**
     * Start an asynchronous post generation job
     * @param campaignId The ID of the campaign
     * @returns Job ID for tracking the processing status
     */
    async startPostGenerationJob(campaignId: string): Promise<string> {
        const AffiliateCampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const campaign = await Repository.findOne(AffiliateCampaignsEntity, { id: campaignId });

        if (!campaign)
            throw new Error(`Campaign with ID ${campaignId} not found`);

        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const couponsResult = await Repository.findAll(AffiliateCouponsEntity, {
            campaign: campaignId,
            active: true,
            limit: 1
        });

        if (!couponsResult || !couponsResult.data || couponsResult.data.length === 0)
            throw new Error(`No active coupons found for campaign ${campaign.name}`);

        const jobId = `post-job-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

        const job: PostJob = {
            id: jobId,
            campaignId: campaignId,
            type: 'post',
            status: 'pending',
            startTime: new Date()
        };

        this.postJobs.set(jobId, job);
        setTimeout(() => this.processPostJob(jobId), 0);

        return jobId;
    }

    /**
     * Process a post generation job asynchronously
     * @param jobId The ID of the job to process
     */
    private async processPostJob(jobId: string): Promise<void> {
        const job = this.postJobs.get(jobId);
        if (!job) {
            this.logger.error(`Job ${jobId} not found`);
            return;
        }

        try {
            job.status = 'processing';
            this.postJobs.set(jobId, job);

            this.logger.log(`Processing post job ${jobId} for campaign ${job.campaignId}`);
            const result = await this.generateBestCouponsPost(job.campaignId);

            job.result = result;
            job.status = 'completed';
            this.postJobs.set(jobId, job);

            this.logger.log(`Post job ${jobId} completed successfully`);

        } catch (error: any) {
            this.logger.error(`Error processing post job ${jobId}: ${error.message}`);
            job.status = 'error';
            job.error = error.message;
            this.postJobs.set(jobId, job);
        }
    }

    /**
     * Get the status and result of a post job
     * @param jobId The ID of the job to check
     * @returns The current status and result (if available) of the job
     */
    async getPostJobStatus(jobId: string) {
        const job = this.postJobs.get(jobId);

        if (!job)
            throw new Error(`Job ${jobId} not found`);

        this.cleanupOldJobs();

        if (job.status === 'completed') {
            return {
                status: job.status,
                result: job.result
            };
        } else if (job.status === 'error') {
            return {
                status: job.status,
                error: job.error
            };
        } else {
            return {
                status: job.status
            };
        }
    }

    /**
     * Clean up old completed/error jobs to prevent memory leaks
     */
    private cleanupOldJobs() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        for (const [jobId, job] of this.postJobs.entries()) {
            if ((job.status === 'completed' || job.status === 'error') && job.startTime < oneHourAgo) {
                this.postJobs.delete(jobId);
            }
        }
    }

    /**
     * Search for appropriate cover image using Unsplash API
     * @param searchQueries Array of search queries to try
     * @returns URL of found image or null
     */
    private async searchCoverImage(searchQueries: string[]): Promise<string | null> {
        try {
            const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

            if (!unsplashAccessKey)
                return null;

            for (const query of searchQueries) {
                try {
                    const response = await fetch(
                        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=1&per_page=10&orientation=landscape`,
                        {
                            headers: {
                                'Authorization': `Client-ID ${unsplashAccessKey}`,
                                'Accept-Version': 'v1'
                            }
                        }
                    );

                    if (!response.ok) {
                        console.warn(`[CouponsService] Unsplash API error: ${response.status}`);
                        continue;
                    }

                    const data = await response.json();

                    if (data.results && data.results.length > 0) {
                        const suitableImages = data.results.filter((image: any) =>
                            image.width >= 1200 &&
                            image.height >= 600 &&
                            !image.description?.toLowerCase().includes('nsfw') &&
                            !image.alt_description?.toLowerCase().includes('person')
                        );

                        if (suitableImages.length > 0) {
                            const randomIndex = Math.floor(Math.random() * Math.min(3, suitableImages.length));
                            const selectedImage = suitableImages[randomIndex];
                            return selectedImage.urls.regular;
                        }
                    }
                } catch (queryError) {
                    continue;
                }
            }

            return null;
        } catch (error) {
            console.error('[CouponsService] Error in searchCoverImage:', error);
            return null;
        }
    }

    /**
     * Increment the view count for a specific coupon
     * @param couponId The ID or code of the coupon
     * @returns Success status
     */
    async incrementCouponView(couponId: string) {
        try {
            if (!couponId)
                throw new Error('Coupon ID or code is required');

            const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");

            let coupon = await Repository.findOne(AffiliateCouponsEntity, {
                id: couponId
            });

            if (!coupon) {
                coupon = await Repository.findOne(AffiliateCouponsEntity, {
                    code: couponId
                });
            }

            if (!coupon) {
                throw new Error(`Coupon with ID or code ${couponId} not found`);
            }

            const currentViews = parseInt(String(coupon.views), 10) || 0;
            const updatedViews = currentViews + 1;


            await Repository.update(AffiliateCouponsEntity, {
                id: coupon.id
            }, {
                views: updatedViews
            });

            return {
                success: true,
                views: updatedViews,
                couponId: coupon.id
            };
        } catch (error: any) {
            this.logger.error(`Error incrementing coupon view: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate short URLs for all coupons that don't have them
     * @param batchSize Number of coupons to process at once (default: 50)
     * @returns Processing results with counts and any errors
     */
    async generateMissingShortUrls(batchSize: number = 50) {
        try {
            this.logger.log('Starting to generate short URLs for coupons without them');

            const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");

            const couponsWithoutShortUrl = await Repository.findAll(AffiliateCouponsEntity, {
                deeplink: Not(IsNull()),
                link: Not(IsNull()),
                active: true,
                limit: 10000
            }, [], {
                select: ["id", "code", "deeplink", "title"]
            });

            if (!couponsWithoutShortUrl || !couponsWithoutShortUrl.data || couponsWithoutShortUrl.data.length === 0) {
                this.logger.log('No coupons found without short URLs');
                return {
                    success: true,
                    message: 'No coupons found without short URLs',
                    processed: 0,
                    updated: 0,
                    errors: []
                };
            }

            const coupons = couponsWithoutShortUrl.data;
            this.logger.log(`Found ${coupons.length} coupons without short URLs`);

            let processed = 0;
            let updated = 0;
            const errors: Array<{ couponId: string; error: string }> = [];

            for (let i = 0; i < coupons.length; i += batchSize) {
                const batch = coupons.slice(i, i + batchSize);
                this.logger.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(coupons.length / batchSize)} (${batch.length} coupons)`);

                const batchPromises = batch.map(async (coupon: any) => {
                    try {
                        processed++;
                        const shortUrl = await this.shortUrlService.createShortUrl(coupon.deeplink);

                        await Repository.update(AffiliateCouponsEntity, {
                            id: coupon.id
                        }, {
                            shortUrl: shortUrl
                        });

                        updated++;
                        this.logger.log(`Generated short URL for coupon ${coupon.code} (${coupon.id}): ${shortUrl}`);

                        return {
                            success: true,
                            couponId: coupon.id,
                            shortUrl: shortUrl
                        };

                    } catch (error: any) {
                        console.log(coupon.deeplink);
                        const errorMessage = error.message || 'Unknown error';
                        this.logger.error(`Failed to generate short URL for coupon ${coupon.code} (${coupon.id}): ${errorMessage}`);

                        errors.push({
                            couponId: coupon.id,
                            error: errorMessage
                        });

                        return {
                            success: false,
                            couponId: coupon.id,
                            error: errorMessage
                        };
                    }
                });

                await Promise.all(batchPromises);

                if (i + batchSize < coupons.length)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }

            const result = {
                success: true,
                message: `Short URL generation completed. Processed ${processed} coupons, updated ${updated} successfully`,
                totalFound: coupons.length,
                processed: processed,
                updated: updated,
                errors: errors.length,
                errorDetails: errors.slice(0, 10)
            };

            this.logger.log(`Short URL generation completed: ${JSON.stringify(result)}`);
            return result;

        } catch (error: any) {
            const errorMessage = `Failed to generate missing short URLs: ${error.message}`;
            this.logger.error(errorMessage);

            return {
                success: false,
                message: errorMessage,
                processed: 0,
                updated: 0,
                errors: []
            };
        }
    }
}
