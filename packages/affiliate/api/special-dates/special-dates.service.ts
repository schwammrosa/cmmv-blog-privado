import { Service } from "@cmmv/core";
import { Repository } from "@cmmv/repository";

@Service()
export class AffiliateSpecialDatesService {
    constructor() {}

    async getSpecialDates(queries: any) {
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
    }
}