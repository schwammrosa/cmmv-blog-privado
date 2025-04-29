import {
    Controller, Get, RouterSchema,
    Post, Body, Header
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import { Application } from "@cmmv/core";

import {
    ThemesPublicService
} from "./themes.service";

import { Theme } from "./themes.service";

@Controller("blog")
export class ThemesPublicController {
    constructor(private readonly themesPublicService: ThemesPublicService){}

    @Get("themes", {
        contract: Application.getContract("ThemesContract"),
        schema: RouterSchema.GetAll,
        summary: "Get all themes",
        exposeFilters: true,
        exclude: true
    })
    @Auth("themes:read")
    async getInstalledThemes() {
        return this.themesPublicService.getInstalledThemes();
    }

    @Post("themes", {
        contract: Application.getContract("ThemesContract"),
        summary: "Upsert themes",
        exclude: true
    })
    async upsertThemes(@Body() themes: Theme[], @Header("Authorization") authorization: string) {
        if (authorization.split(" ")[1] !== process.env.API_SIGNATURE)
            throw new Error("Invalid signature");

        return this.themesPublicService.upsertTheme(themes);
    }

    @Post("themes/active", { exclude: true })
    async setActiveTheme(@Body() payload: { themeName: string }) {
        return this.themesPublicService.setActiveTheme(payload.themeName);
    }
}

