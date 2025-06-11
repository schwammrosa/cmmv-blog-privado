import { Service } from "@cmmv/core";
import { Repository } from "@cmmv/repository";

@Service()
export class AffiliateSpecialDatesService {
    constructor() {}

    async getSpecialDates(queries: any) {
        const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
        
        // Se não especificou active, filtrar apenas as ativas por padrão
        if (queries.active === undefined || queries.active === null) {
            queries.active = true;
        }
        
        return await Repository.findAll(SpecialDatesEntity, queries);
    }

    async getCampaignsBySpecialDate(specialDateId: string) {
        try {
            const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
            const CampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

            // Buscar a special date
            const specialDate = await Repository.findOne(SpecialDatesEntity, {
                id: specialDateId
            });

            if (!specialDate || !specialDate.campaigns || specialDate.campaigns.length === 0) {
                return [];
            }

            // Buscar as campanhas relacionadas
            const campaigns = await Repository.findAll(CampaignsEntity, {
                id: specialDate.campaigns,
                active: true
            }, [], {
                select: [
                    "id", "name", "logo", "highlight", "slug", "description"
                ]
            });

            return campaigns?.data || [];
        } catch (error) {
            console.error('Error fetching campaigns by special date:', error);
            return [];
        }
    }

    async getCampaignsBySpecialDateSlug(slug: string) {
        try {
            const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
            const CampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

            // Buscar a special date pelo slug
            const specialDate = await Repository.findOne(SpecialDatesEntity, {
                slug: slug
            });

            if (!specialDate || !specialDate.campaigns || specialDate.campaigns.length === 0) {
                return [];
            }

            // Buscar as campanhas relacionadas
            const campaigns = await Repository.findAll(CampaignsEntity, {
                id: specialDate.campaigns,
                active: true
            }, [], {
                select: [
                    "id", "name", "logo", "highlight", "slug", "description"
                ]
            });

            return campaigns?.data || [];
        } catch (error) {
            console.error('Error fetching campaigns by special date slug:', error);
            return [];
        }
    }
}