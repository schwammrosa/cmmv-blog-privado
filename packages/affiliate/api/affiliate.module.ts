import { Module } from '@cmmv/core';

import {
    AffiliateCampaignsContract,
    AffiliateNetworksContract,
    AffiliateCouponsContract,
    AffiliateAccountsContract,
    AffiliateCategoriesContract
} from '../contracts';

import {
    AffiliateCouponsModule
} from './coupons/coupons.module';

import {
    AffiliateCategoriesModule
} from './categories/categories.module';

import {
    AffiliateCampaignsModule
} from './campaigns/campaigns.module';

export const AffiliateModule = new Module('affiliate', {
    contracts: [
        AffiliateNetworksContract,
        AffiliateCampaignsContract,
        AffiliateCouponsContract,
        AffiliateAccountsContract,
        AffiliateCategoriesContract
    ],
    submodules: [
        AffiliateCouponsModule,
        AffiliateCategoriesModule,
        AffiliateCampaignsModule
    ]
});
