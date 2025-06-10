import { Module } from '@cmmv/core';

import {
    AffiliateSpecialDatesService
} from "./special-dates.service";

import {
    AffiliateSpecialDatesController
} from "./special-dates.controller";

export const AffiliateSpecialDatesModule = new Module('affiliate-special-dates', {
    providers: [AffiliateSpecialDatesService],
    controllers: [AffiliateSpecialDatesController]
});