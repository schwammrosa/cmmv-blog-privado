import { Module } from '@cmmv/core';

import {
    OddsBetsContract,
    OddsCountriesContract,
    OddsLeaguesContract,
    OddsCategoriesContract,
    OddsSettingsContract,
    OddsVenuesContract
} from '../contracts';

import {
    OddsCountriesModule
} from './countries/countries.module';

import {
    OddsCategoriesModule
} from './categories/categories.module';

import {
    OddsSettingsModule
} from './settings/settings.module';

import { OddsLeaguesModule } from './leagues/leagues.module';
import { OddsVenuesModule } from './venues/venues.module';

export const OddsModule = new Module('odds', {
    contracts: [
        OddsBetsContract,
        OddsCountriesContract,
        OddsLeaguesContract,
        OddsCategoriesContract,
        OddsSettingsContract,
        OddsVenuesContract
    ],
    submodules: [
        OddsCountriesModule,
        OddsCategoriesModule,
        OddsSettingsModule,
        OddsLeaguesModule,
        OddsVenuesModule
    ]
});
