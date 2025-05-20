import {
    Controller, Get, Param,
    Query
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    DeeplinkService
} from "./deeplink.service";

@Controller("affiliate/deeplink")
export class DeeplinkController {
    constructor(private readonly deeplinkService: DeeplinkService){}

    @Get("/:accountId/:campaignId")
    @Auth("affiliatedeeplink:get")
    async getDeeplink(
        @Param("accountId") accountId: string,
        @Param("campaignId") campaignId: string,
        @Query("link") link: string
    ) {
        return this.deeplinkService.getDeeplink(accountId, campaignId, link);
    }
}
