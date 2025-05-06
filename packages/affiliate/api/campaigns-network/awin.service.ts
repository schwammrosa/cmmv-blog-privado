import { Service, Application } from "@cmmv/core";

@Service()
export class AwinService {
    async getCampaigns(publisherId: string, accessToken: string, countryCode: string = "BR"){
        const response = await fetch(`https://api.awin.com/publishers/${publisherId}/programmes?accessToken=${accessToken}&countryCode=${countryCode}`);
        const data = await response.json();

        return data.map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            url: campaign.displayUrl,
            image: campaign.logoUrl,
            status: campaign.status,
            currencyCode: campaign.currencyCode,
            sector: campaign.primarySector,
            domain: campaign.domain[0].domain
        }));
    }
}
