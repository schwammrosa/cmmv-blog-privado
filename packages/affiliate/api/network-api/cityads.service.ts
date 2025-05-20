import * as url from "node:url";
import { Service } from "@cmmv/core";

import {
    NetworkApiAbstract
} from "./network-api.abstract";

@Service("cityads")
export class CityadsService extends NetworkApiAbstract {
    async getCampaigns(urlApi: string){
        const response = await fetch(urlApi);
        const data = (response.status === 200) ? await response.json() : [];

        return (data.offers.length > 0) ? data.offers
            .filter((campaign: any) => campaign.offer_currency.name === "BRL")
            .map((campaign: any) => ({
                id: campaign.id,
                name: campaign.name,
                description: campaign.description,
                url: campaign.site_url,
                image: campaign.logo,
                active: campaign.is_available,
                currencyCode: campaign.offer_currency.name,
                sector: campaign.category.name,
                domain: url.parse(campaign.site_url).hostname?.replace("www.", "")
            })) : [];
    }

    async getCoupons(urlApi: string){
        const response = await fetch(urlApi, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = (response.status === 200) ? await response.json() : [];
        const dataReturn = [];
        const coupons = data.data.items;

        for(const key in coupons){
            const coupon = coupons[key];
            const resolvedLink = await this.resolveShortenedUrl(coupon.url);

            dataReturn.push({
                title: coupon.name,
                description: coupon.description,
                code: coupon.promo_code.trim(),
                active: (coupon.status !== "Active"),
                expiration: new Date(coupon.active_to),
                link: resolvedLink,
                advertiser: coupon.offer_id,
                promotionId: coupon.id
            });
        }

        return dataReturn;
    }

    async getDeeplink(urlApi: string){
        return urlApi;
    }
}
