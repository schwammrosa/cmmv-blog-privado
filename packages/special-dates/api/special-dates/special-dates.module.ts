import { Module } from '@cmmv/core';

import {
    SpecialDatesService
} from "./special-dates.service";

import {
    SpecialDatesController
} from "./special-dates.controller";

export const SpecialDatesEndpointsModule = new Module('special-dates-endpoints', {
    providers: [SpecialDatesService],
    controllers: [SpecialDatesController]
}); 