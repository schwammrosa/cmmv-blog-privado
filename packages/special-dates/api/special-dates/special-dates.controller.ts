import {
    Controller,
    Get,
    Queries,
    Param
} from "@cmmv/http";

import {
    SpecialDatesService
} from "./special-dates.service";

import { Repository } from "@cmmv/repository";

@Controller("special-dates")
export class SpecialDatesController {
    // The basic CRUD is generated because of 'generateController: true' in the contract.
    // This file can be used to add custom endpoints in the future.
    constructor(private readonly specialDatesService: SpecialDatesService) {}

    @Get("/", {
        exclude: true
    })
    async getSpecialDates(@Queries() queries: any) {
        // Se houver um slug na consulta, buscar diretamente
        if (queries.slug) {
            const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
            const result = await Repository.findOne(SpecialDatesEntity, { slug: queries.slug });
            return result;
        }
        return await this.specialDatesService.getSpecialDates(queries);
    }

    @Get("find-by-slug/:slug", {
        exclude: true
    })
    async findBySlug(@Param("slug") slug: string) {
        // Implementando diretamente a busca por slug sem usar o método do serviço
        const SpecialDatesEntity = Repository.getEntity("SpecialDatesEntity");
        const result = await Repository.findOne(SpecialDatesEntity, { slug: slug });
        return result;
    }
} 