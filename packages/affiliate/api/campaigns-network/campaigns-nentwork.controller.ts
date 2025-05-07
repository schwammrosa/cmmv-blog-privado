import {
    Controller, Get, Param,
    CacheControl, ContentType,
    Raw, Put, Body, Post, Delete, Queries
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    CampaignsNetworksToolsService
} from "./campaigns-nentwork.service";

@Controller("affiliate/campaigns-networks")
export class CampaignsNetworksControllerTools {
    constructor(private readonly campaignsNetworksService: CampaignsNetworksToolsService){}

    @Get("/apis-supported")
    @ContentType("application/json")
    @Raw()
    async getApisSupported(){
        return this.campaignsNetworksService.getApisSupported();
    }

    @Get("/network-campaigns")
    async getNetworkCampaigns() {
        return this.campaignsNetworksService.getNetworkCampaigns();
    }

    @Get("/coupons")
    async getCoupons() {
        return this.campaignsNetworksService.getCoupons();
    }
}
