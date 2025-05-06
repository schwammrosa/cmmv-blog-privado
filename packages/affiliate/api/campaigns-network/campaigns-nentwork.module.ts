import { Module } from '@cmmv/core';

import {
    CampaignsNetworksToolsService
} from "./campaigns-nentwork.service";

import {
    CampaignsNetworksControllerTools
} from "./campaigns-nentwork.controller";

export const AffiliateCampaignsNetworksModule = new Module('affiliate-campaigns-networks-tools', {
    providers: [CampaignsNetworksToolsService],
    controllers: [CampaignsNetworksControllerTools]
});
