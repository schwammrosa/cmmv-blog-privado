import { Service } from "@cmmv/core";

@Service()
export class AwinService {
    async getCampaigns(urlApi: string){
        const response = await fetch(urlApi);
        const data = await response.json();

        return data.map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            url: campaign.displayUrl,
            image: campaign.logoUrl,
            active: campaign.status === "Active",
            currencyCode: campaign.currencyCode,
            sector: campaign.primarySector,
            domain: (campaign.validDomains && campaign.validDomains.length > 0) ? campaign.validDomains[0].domain : campaign.validDomains
        }));
    }

    async getCoupons(urlApi: string){
        const response = await fetch(urlApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "filters": {
                    "exclusiveOnly": false,
                    "regionCodes": ["BR"],
                    "type": "voucher"
                },
                "pagination": {
                    "page": 1,
                    "pageSize": 100
                }
            })
        });

        const result = await response.json();

        return result.data.map((coupon: any) => ({
            title: coupon.title,
            description: coupon.description,
            code: coupon.voucher.code,
            active: coupon.status === "active",
            expiration: new Date(coupon.endDate),
            link: coupon.url,
            advertiser: coupon.advertiser.id,
            promotionId: coupon.promotionId,
        }));
    }
}
