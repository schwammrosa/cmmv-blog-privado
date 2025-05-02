import { Module } from '@cmmv/core';

import {
    AffiliateCampainsContract,
    AffiliateNetworksContract,
    AffiliateCouponsContract
} from '../contracts';

export const AffiliateModule = new Module('affiliate', {
    contracts: [
        AffiliateNetworksContract,
        AffiliateCampainsContract,
        AffiliateCouponsContract
    ],
    submodules: [

    ]
});
