import {
    Controller, Get,
    Queries, Param
} from "@cmmv/http";
import { Application } from "@cmmv/core";

import {
    AffiliateSpecialDatesService
} from "./special-dates.service";

@Controller("affiliate/special-dates")
export class AffiliateSpecialDatesController {
    constructor(private readonly specialDatesService: AffiliateSpecialDatesService) {}

<<<<<<< HEAD
    @Get()
=======
    @Get("/", {
        exclude: true
    })
    async getSpecialDates(@Queries() queries: any) {
        if (queries.slug) {
            const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
            const result = await Repository.findOne(SpecialDatesEntity, { slug: queries.slug });
            return result;
        }
>>>>>>> b34b08d831291ea303ec26652ee7c3d56bb2acb1

    async getSpecialDates(@Queries() queries: any) {
        return await this.specialDatesService.getSpecialDates(queries);
    }

    @Get("find-by-slug/:slug")
    async findBySlug(@Param("slug") slug: string) {
<<<<<<< HEAD
        return await this.specialDatesService.findBySlug(slug);
=======
        const SpecialDatesEntity = Repository.getEntity("AffiliateSpecialDatesEntity");
        const result = await Repository.findOne(SpecialDatesEntity, { slug: slug });
        return result;
>>>>>>> b34b08d831291ea303ec26652ee7c3d56bb2acb1
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