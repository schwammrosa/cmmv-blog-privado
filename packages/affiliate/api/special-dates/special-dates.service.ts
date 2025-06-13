import { Service, Logger } from "@cmmv/core";
import { Repository } from "@cmmv/repository";
import { In } from "typeorm";

@Service()
export class AffiliateSpecialDatesService {
    private readonly logger = new Logger("AffiliateSpecialDatesService");

    async getSpecialDates(queries: any) {
<<<<<<< HEAD
        const AffiliateSpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");

        if (queries.slug) {
            const result = await Repository.findOne(AffiliateSpecialDatesEntity, { slug: queries.slug });
            return result;
        }

        return await Repository.findAll(AffiliateSpecialDatesEntity, queries);
    }

    async findBySlug(slug: string) {
        const AffiliateSpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
        return await Repository.findOne(AffiliateSpecialDatesEntity, { slug: slug });
=======
        const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
        
        if (queries.active === undefined || queries.active === null) {
            queries.active = true;
        }
        
        return await Repository.findAll(SpecialDatesEntity, queries);
>>>>>>> b34b08d831291ea303ec26652ee7c3d56bb2acb1
    }

    async getCampaignsBySpecialDate(specialDateId: string) {
        try {
            const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
            const CampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

            const specialDate = await Repository.findOne(SpecialDatesEntity, {
                id: specialDateId
            });
            if (!specialDate || !specialDate.campaigns || specialDate.campaigns.length === 0) {
                return [];
            }
            
            const campaigns = await Repository.findAll(CampaignsEntity, {
                id: In(specialDate.campaigns),
                active: true
            }, [], {
                select: [
                    "id", "name", "logo", "highlight", "slug", "description"
                ]
            });

            return campaigns?.data || [];
        } catch (error) {
            console.error('Error fetching campaigns by special date ID:', error);
            return [];
        }
    }

    async getCampaignsBySpecialDateSlug(slug: string) {
        try {
            const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
            const CampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");

            const specialDate = await Repository.findOne(SpecialDatesEntity, {
                slug: slug
            });

            if (!specialDate || !specialDate.campaigns || specialDate.campaigns.length === 0) {
                return [];
            }

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