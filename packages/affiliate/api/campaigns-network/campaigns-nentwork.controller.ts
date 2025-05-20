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
    @Auth("affiliatecampaignsnetworks:get")
    async getApisSupported(){
        return this.campaignsNetworksService.getApisSupported();
    }

    @Get("/network-campaigns")
    @Auth("affiliatecampaignsnetworks:get")
    async getNetworkCampaigns() {
        return this.campaignsNetworksService.getNetworkCampaigns();
    }

    @Get("/coupons")
    @Auth("affiliatecampaignsnetworks:get")
    async getCoupons() {
        return this.campaignsNetworksService.getCoupons();
    }

    @Get("/network-campaigns/:networkId")
    @Auth("affiliatecampaignsnetworks:get")
    async getNetworkCampaignsByNetwork(@Param("networkId") networkId: string) {
        return this.campaignsNetworksService.getNetworkCampaignsByNetwork(networkId);
    }

    @Get("/network-campaigns-list/:networkId")
    @Auth("affiliatecampaignsnetworks:get")
    async getNetworkCampaignsList(@Param("networkId") networkId: string) {
        return this.campaignsNetworksService.getNetworkCampaignsList(networkId);
    }

    @Get("/coupons/:networkId")
    @Auth("affiliatecampaignsnetworks:get")
    async getCouponsByNetwork(@Param("networkId") networkId: string) {
        return this.campaignsNetworksService.getCouponsByNetwork(networkId);
    }
}
