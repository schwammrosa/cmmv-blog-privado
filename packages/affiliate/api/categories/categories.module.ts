import { Module } from '@cmmv/core';

import {
    CategoriesServiceTools
} from "./categories.service";

import {
    CategoriesControllerTools
} from "./categories.controller";

export const AffiliateCategoriesModule = new Module('affiliate-categories-tools', {
    providers: [CategoriesServiceTools],
    controllers: [CategoriesControllerTools]
});
