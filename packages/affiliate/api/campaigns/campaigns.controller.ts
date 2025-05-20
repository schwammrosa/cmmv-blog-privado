import {
    Controller, Get, Param,
    CacheControl, ContentType,
    Raw, Put, Body, Post, Delete, Query
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    CampaignsServiceTools
} from "./campaigns.service";

@Controller("affiliate/campaigns")
export class CampaignsControllerTools {
    constructor(private readonly campaignsService: CampaignsServiceTools){}

    @Put(":campaignId/logo")
    @Auth("affiliatecampaigns:update")
    async updateCampaignLogo(@Param("campaignId") campaignId: string, @Body() data: { logo: string }) {
        return await this.campaignsService.updateCampaignLogo(campaignId, data.logo);
    }
}
