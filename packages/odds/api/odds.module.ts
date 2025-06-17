import { Module } from '@cmmv/core';

import {
    OddsBetsContract,
    OddsCountriesContract,
    OddsLeaguesContract,
    OddsCategoriesContract,
    OddsSettingsContract
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

export const OddsModule = new Module('odds', {
    contracts: [
        OddsBetsContract,
        OddsCountriesContract,
        OddsLeaguesContract,
        OddsCategoriesContract,
        OddsSettingsContract
    ],
    submodules: [
        OddsCountriesModule,
        OddsCategoriesModule,
        OddsSettingsModule,
        OddsLeaguesModule
    ]
});
