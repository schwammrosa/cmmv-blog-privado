import {
    Controller,
    Get,
    Queries,
    Param
} from "@cmmv/http";
import { Application } from "@cmmv/core";

import {
    AffiliateSpecialDatesService
} from "./special-dates.service";

import { Repository } from "@cmmv/repository";

@Controller("affiliate/special-dates")
export class AffiliateSpecialDatesController {
    constructor(private readonly specialDatesService: AffiliateSpecialDatesService) {}

    @Get("/", {
        exclude: true
    })
    async getSpecialDates(@Queries() queries: any) {
        if (queries.slug) {
            const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
            const result = await Repository.findOne(SpecialDatesEntity, { slug: queries.slug });
            return result;
        }

        return await this.specialDatesService.getSpecialDates(queries);
    }

    @Get("find-by-slug/:slug", {
        exclude: true
    })
    async findBySlug(@Param("slug") slug: string) {
        const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
        const result = await Repository.findOne(SpecialDatesEntity, { slug: slug });
        return result;
    }

    @Get("campaigns/:specialDateId", {
        exclude: true
    })
    async getCampaignsBySpecialDate(@Param("specialDateId") specialDateId: string) {
        const service = Application.resolveProvider(AffiliateSpecialDatesService);
        return await service.getCampaignsBySpecialDate(specialDateId);
    }

    @Get("campaigns/slug/:slug", {
        exclude: true
    })
    async getCampaignsBySpecialDateSlug(@Param("slug") slug: string) {
        return await this.specialDatesService.getCampaignsBySpecialDateSlug(slug);
    }
}