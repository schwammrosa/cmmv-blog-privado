import { Module } from '@cmmv/core';

import {
    SpecialDatesContract
} from '../contracts';

import {
    SpecialDatesEndpointsModule
} from './special-dates/special-dates.module';

export const SpecialDatesModule = new Module('special-dates', {
    contracts: [
        SpecialDatesContract
    ],
    submodules: [
        SpecialDatesEndpointsModule
    ]
}); 