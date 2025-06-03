import { Service, Application, Config } from "@cmmv/core";
import { Repository } from "@cmmv/repository";
//@ts-ignore
import { MediasService } from "@cmmv/blog";
//@ts-ignore
import { AIContentService } from "@cmmv/ai-content";
import { CouponsServiceTools } from "../coupons/coupons.service";

@Service()
export class CampaignsServiceTools {
    /**
     * Update the logo of a campaign
     * @param campaignId - The ID of the campaign
     * @param logo - The logo of the campaign as a base64 string
     * @returns The updated campaign
     */
    async updateCampaignLogo(campaignId: string, logo: string) {
        const CampaignEntity = Repository.getEntity("AffiliateCampaignsEntity");

        const campaign = await Repository.findOne(CampaignEntity, {
            id: campaignId
        });

        if (!campaign)
            throw new Error("Campaign not found");

        const mediasService: any = Application.resolveProvider(MediasService);
        const logoUrl = await mediasService.getImageUrl(logo);

        const affectedRows = await Repository.update(CampaignEntity, campaignId, {
            logo: logoUrl
        });

        return { affected: affectedRows};
    }

    /**
     * Generate SEO content for a campaign using AI
     * @param campaignId - The ID of the campaign
     * @returns The generated SEO content
     */
    async generateSEOContent(campaignId: string) {
        const language = Config.get("blog.language", "en");
        const CampaignEntity = Repository.getEntity("AffiliateCampaignsEntity");

        const campaign = await Repository.findOne(CampaignEntity, {
            id: campaignId
        });

        if (!campaign)
            throw new Error("Campaign not found");

        if (!campaign.domain)
            throw new Error("Campaign domain is required for SEO generation");

        try {
            const shortContentPrompt = `Generate SEO content for a coupon discount website for the store "${campaign.name}" (domain: ${campaign.domain}).

I need:
1. Title: An SEO optimized title (maximum 60 characters) focused on discount coupons
2. Subtitle: A catchy subtitle (maximum 120 characters)
3. SmallText: A short text (maximum 160-500 characters) for meta description

Focus on keywords like "discount coupon", "promotion", "offer", "savings" and the store name.

IMPORTANT: Respond in ${language} language.

Respond in JSON format:
{
  "title": "title here",
  "subtitle": "subtitle here",
  "smallText": "small text here"
}`;

            const longContentPrompt = `Write a detailed text about the store "${campaign.name}" (domain: ${campaign.domain}) for a discount coupon website.

The text should include:
- General information about the store
- Types of products/services offered
- How to use discount coupons in the store
- Tips for finding the best deals
- How to apply coupons at checkout
- Benefits of shopping at the store

Text should be 2000-4000 words, informative and SEO optimized.

IMPORTANT:
- Respond in ${language} language
- Format the response in HTML with proper tags (h2, h3, p, ul, li, etc.)
- Do not include <html>, <head>, or <body> tags, just the content HTML
- Use semantic HTML structure with headings and paragraphs
- Convert any markdown formatting to proper HTML tags

Respond only with the HTML formatted text, without JSON formatting.`;

            const aiService = Application.resolveProvider<any>(AIContentService);

            const [shortContentResponse, longContentResponse] = await Promise.all([
                aiService.generateContent(shortContentPrompt),
                aiService.generateContent(longContentPrompt)
            ]);

            let shortContent;
            try {
                let jsonText = '';
                if (typeof shortContentResponse === 'string') {
                    const jsonStartIndex = shortContentResponse.indexOf('{');
                    const jsonEndIndex = shortContentResponse.lastIndexOf('}') + 1;

                    if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex)
                        jsonText = shortContentResponse.substring(jsonStartIndex, jsonEndIndex);
                    else
                        jsonText = shortContentResponse;

                    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
                } else {
                    jsonText = JSON.stringify(shortContentResponse);
                }

                shortContent = JSON.parse(jsonText);
            } catch (e) {
                shortContent = {
                    title: `Discount Coupons ${campaign.name} - Exclusive Offers`,
                    subtitle: `Save on your purchases at ${campaign.name} with our verified coupons`,
                    smallText: `Find the best discount coupons for ${campaign.name}. Exclusive offers and verified promotional codes.`
                };
            }

            let longContentText = '';

            if (typeof longContentResponse === 'string') {
                longContentText = longContentResponse.trim();
                longContentText = longContentText.replace(/```html\s*/g, '').replace(/```\s*$/g, '').trim();
            } else {
                longContentText = JSON.stringify(longContentResponse);
            }

            const seoMetadata = {
                seoTitle: shortContent.title,
                seoSubtitle: shortContent.subtitle,
                seoSmallText: shortContent.smallText,
                seoLongText: longContentText
            };

            let existingMetadata = {};
            if (campaign.metadata) {
                try {
                    existingMetadata = JSON.parse(campaign.metadata);
                } catch (e) {
                    existingMetadata = {};
                }
            }

            const updatedMetadata = {
                ...existingMetadata,
                ...seoMetadata
            };

            await Repository.update(CampaignEntity, campaignId, {
                metadata: JSON.stringify(updatedMetadata)
            });

            return {
                success: true,
                seoContent: seoMetadata
            };

        } catch (error: any) {
            throw new Error(`Failed to generate SEO content: ${error.message}`);
        }
    }

    /**
     * Get the list of campaigns that are public
     * @returns The list of campaigns
     */
    async getCampaignsPublicList(){
        const CampaignEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const campaigns = await Repository.findAll(CampaignEntity, {
            active: true,
            limit: 10000
        }, [], {
            select: [
                "id", "name", "logo", "description", "highlight", "slug",
                "seoTitle", "seoSubtitle", "seoSmallText", "seoLongText"
            ]
        });

        return (campaigns && campaigns.data.length > 0) ? campaigns?.data : [];
    }

    /**
     * Get the list of campaigns that are public with their active coupon counts
     * @returns The list of campaigns with coupon counts
     */
    async getCampaignsPublicListWithCouponCounts() {
        const CampaignEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const campaignsResult = await Repository.findAll(CampaignEntity, {
            active: true,
            limit: 10000
        }, [], {
            select: [
                "id", "name", "logo", "description", "highlight", "slug", "categories",
                "seoTitle", "seoSubtitle", "seoSmallText", "seoLongText"
            ]
        });

        if (!campaignsResult || campaignsResult.data.length === 0) {
            return [];
        }

        const couponsService = Application.resolveProvider(CouponsServiceTools);
        const campaignsWithCounts = [];

        for (const campaign of campaignsResult.data) {
            try {
                const couponCountResponse = await couponsService.getCouponsCountByCampaignId(campaign.id);
                campaignsWithCounts.push({
                    ...campaign,
                    couponCount: couponCountResponse?.count || 0
                });
            } catch (err) {
                campaignsWithCounts.push({
                    ...campaign,
                    couponCount: 0
                });
            }
        }

        campaignsWithCounts.sort((a, b) => {
            const aIsHighlighted = !!a.highlight;
            const bIsHighlighted = !!b.highlight;

            if (aIsHighlighted && !bIsHighlighted) return -1;
            if (!aIsHighlighted && bIsHighlighted) return 1;

            const aCoupons = Number(a.couponCount || 0);
            const bCoupons = Number(b.couponCount || 0);

            if (bCoupons !== aCoupons)
                return bCoupons - aCoupons;

            return (a.name || "").localeCompare(b.name || "");
        });

        return campaignsWithCounts;
    }

    /**
     * Export the campaigns
     * @returns The campaigns
     */
    async export(){
        const CampaignEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const campaigns = await Repository.findAll(CampaignEntity, { limit: 1000000 });
        return (campaigns && campaigns.data.length > 0) ? JSON.stringify(campaigns.data, null, 4) : "";
    }
}
