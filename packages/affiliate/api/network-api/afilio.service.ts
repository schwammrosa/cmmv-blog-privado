import * as url from "node:url";
import { Service } from "@cmmv/core";

import {
    NetworkApiAbstract
} from "./network-api.abstract";

@Service()
export class AfilioService extends NetworkApiAbstract {
    /**
     * Get campaigns from Afilio
     * @param urlApi
     * @returns
     */
    async getCampaigns(urlApi: string){
        const response = await fetch(urlApi);
        const data = (response.status === 200) ? await response.json() : {};
        const dataReturn = [];
        const campaigns = data[0]["Affiliate Campaign"];

        for(const key in campaigns){
            const campaign = campaigns[key];
            const urlCampaign = url.parse(campaign.url);
            const domain = urlCampaign.hostname;

            dataReturn.push({
                id: campaign.campaign_id,
                name: campaign.campaign_name.split(" | ")[0],
                description: campaign.campaign_description,
                url: campaign.url.split("?")[0],
                image: "",
                active: campaign["campaign_status"] === 1,
                currencyCode: campaign.commissions && campaign.commissions.length > 0 ? campaign.commissions[0]?.currency : "",
                sector: campaign["category_name"],
                domain: domain?.replace("www.", "")
            });
        }

        return dataReturn;
    }

    /**
     * Get coupons from Afilio
     * @param urlApi
     * @returns
     */
    async getCoupons(urlApi: string){
        const response = await fetch(urlApi, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = (response.status === 200) ? await response.json() : [];
        const dataReturn = [];
        const coupons = data[0];

        for(const key in coupons){
            const coupon = coupons[key];
            const resolvedLink = await this.resolveShortenedUrl(coupon.shortened);

            dataReturn.push({
                title: coupon.title,
                description: coupon.description,
                code: coupon.code.trim(),
                active: (coupon.expiration_date !== "Indefinido") ? (new Date(coupon.expiration_date) > new Date()) : true,
                expiration: (coupon.expiration_date !== "Indefinido") ? new Date(coupon.expiration_date) : null,
                link: resolvedLink,
                advertiser: coupon.id_campaign,
                promotionId: coupon.creative_id
            });
        }

        return dataReturn;
    }

    /**
     * Get deeplink from Afilio
     * @param urlApi
     * @param url
     * @returns
     */
    async getDeeplink(urlApi: string){
        return await this.resolveShortenedUrl(urlApi, false);
    }
}
