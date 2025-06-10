import { Service } from "@cmmv/core";
import { Repository } from "@cmmv/repository";

@Service()
export class AffiliateSpecialDatesService {
    constructor() {}

    async getSpecialDates(queries: any) {
        const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
        return await Repository.findAll(SpecialDatesEntity, queries);
    }
}