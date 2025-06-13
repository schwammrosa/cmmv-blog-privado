import {
    Controller,
    Get,
    Queries,
    Param
} from "@cmmv/http";

import {
    AffiliateSpecialDatesService
} from "./special-dates.service";

@Controller("affiliate/special-dates")
export class AffiliateSpecialDatesController {
    constructor(private readonly specialDatesService: AffiliateSpecialDatesService) {}

    @Get("/", {
        exclude: true
    })
    async getSpecialDates(@Queries() queries: any) {
        return await this.specialDatesService.getSpecialDates(queries);
    }

    @Get("find-by-slug/:slug", {
        exclude: true
    })
    async findBySlug(@Param("slug") slug: string) {
        return await this.specialDatesService.findBySlug(slug);
    }

    @Get("campaigns/:specialDateId", {
        exclude: true
    })
    async getCampaignsBySpecialDate(@Param("specialDateId") specialDateId: string) {
        return await this.specialDatesService.getCampaignsBySpecialDate(specialDateId);
    }

    @Get("campaigns/slug/:slug", {
        exclude: true
    })
    async getCampaignsBySpecialDateSlug(@Param("slug") slug: string) {
        return await this.specialDatesService.getCampaignsBySpecialDateSlug(slug);
    }
}