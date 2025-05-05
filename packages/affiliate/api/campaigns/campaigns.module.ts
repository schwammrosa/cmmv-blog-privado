import { Module } from '@cmmv/core';

import {
    CampaignsServiceTools
} from "./campaigns.service";

import {
    CampaignsControllerTools
} from "./campaigns.controller";

export const AffiliateCampaignsModule = new Module('affiliate-campaigns-tools', {
    providers: [CampaignsServiceTools],
    controllers: [CampaignsControllerTools]
});
