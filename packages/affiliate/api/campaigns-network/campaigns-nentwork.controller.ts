import {
    Controller, Get, Param,
    CacheControl, ContentType,
    Raw, Put, Body, Post, Delete, Query
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

}
