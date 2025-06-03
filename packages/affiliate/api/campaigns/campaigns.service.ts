import { Service, Application } from "@cmmv/core";
import { Repository } from "@cmmv/repository";
//@ts-ignore
import { MediasService } from "@cmmv/blog";
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
     * Get the list of campaigns that are public
     * @returns The list of campaigns
     */
    async getCampaignsPublicList(){
        const CampaignEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const campaigns = await Repository.findAll(CampaignEntity, {
            active: true,
            limit: 10000
        }, [], {
            select: ["id", "name", "logo", "description", "highlight", "slug"]
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
            select: ["id", "name", "logo", "description", "highlight", "slug"]
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
                console.error(`Failed to load coupon count for campaign ${campaign.id}:`, err);
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
