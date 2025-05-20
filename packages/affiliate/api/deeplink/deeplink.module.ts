import { Module } from '@cmmv/core';

import {
    DeeplinkService
} from "./deeplink.service";

import {
    DeeplinkController
} from "./deeplink.controller";

export const AffiliateDeeplinkModule = new Module('affiliate-deeplink', {
    providers: [DeeplinkService],
    controllers: [DeeplinkController]
});
