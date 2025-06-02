import { Module } from '@cmmv/core';

import {
    OddsBetsContract
} from '../contracts';

export const OddsModule = new Module('odds', {
    contracts: [
        OddsBetsContract,
    ]
});
