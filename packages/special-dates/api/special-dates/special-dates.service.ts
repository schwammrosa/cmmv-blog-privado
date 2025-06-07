import { Service } from "@cmmv/core";
import { Repository } from "@cmmv/repository";

@Service()
export class SpecialDatesService {
    constructor() {}
    // Custom business logic can be added here.
    // Basic CRUD is handled by the generated controller and repository.
    async getSpecialDates(queries: any) {
        const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
        return await Repository.findAll(SpecialDatesEntity, queries);
    }
} 