import { Module } from '@cmmv/core';

import {
    AffiliateCampaignsContract,
    AffiliateNetworksContract,
    AffiliateCouponsContract,
    AffiliateAccountsContract,
    AffiliateCategoriesContract,
    AffiliateCampaignsNetworksContract
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

import {
    AffiliateCampaignsNetworksModule
} from './campaigns-network/campaigns-nentwork.module';

export const AffiliateModule = new Module('affiliate', {
    contracts: [
        AffiliateNetworksContract,
        AffiliateCampaignsContract,
        AffiliateCouponsContract,
        AffiliateAccountsContract,
        AffiliateCategoriesContract,
        AffiliateCampaignsNetworksContract
    ],
    submodules: [
        AffiliateCouponsModule,
        AffiliateCategoriesModule,
        AffiliateCampaignsModule,
        AffiliateCampaignsNetworksModule
    ]
});
