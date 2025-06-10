import {
    Controller, Get,
    Queries, Param
} from "@cmmv/http";

import {
    AffiliateSpecialDatesService
} from "./special-dates.service";

@Controller("affiliate/special-dates")
export class AffiliateSpecialDatesController {
    constructor(private readonly specialDatesService: AffiliateSpecialDatesService) {}

    @Get()

    async getSpecialDates(@Queries() queries: any) {
        return await this.specialDatesService.getSpecialDates(queries);
    }

    @Get("find-by-slug/:slug")
    async findBySlug(@Param("slug") slug: string) {
        return await this.specialDatesService.findBySlug(slug);
    }
}