import { Module } from '@cmmv/core';

import {
    CouponsServiceTools
} from "./coupons.service";

import {
    CouponsControllerTools
} from "./coupons.controller";

export const AffiliateCouponsModule = new Module('affiliate-coupons-tools', {
    providers: [CouponsServiceTools],
    controllers: [CouponsControllerTools]
});
