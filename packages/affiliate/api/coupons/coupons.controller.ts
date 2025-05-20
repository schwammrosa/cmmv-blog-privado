import {
    Controller, Get, Param,
    CacheControl, ContentType,
    Raw
} from "@cmmv/http";

import {
    Cache
} from "@cmmv/cache";

import {
    Auth
} from "@cmmv/auth";

import {
    CouponsServiceTools
} from "./coupons.service";

@Controller("affiliate/coupons")
export class CouponsControllerTools {
    constructor(private readonly couponsService: CouponsServiceTools){}

    @Get("ai/:campaignId")
    @Auth("affiliatecoupons:get")
    async getCouponsWithAI(@Param("campaignId") campaignId: string) {
        return this.couponsService.getCouponsWithAI(campaignId);
    }

    @Get("campaign/:campaignId")
    @Cache("coupons:")
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    @Auth("affiliatecoupons:get")
    async getCoupons(@Param("campaignId") campaignId: string) {
        return await this.couponsService.getCoupons(campaignId);
    }
}
