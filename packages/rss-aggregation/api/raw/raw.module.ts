import { Module } from '@cmmv/core';

import {
    RawService
} from "./raw.service";

import {
    RawController
} from "./raw.controller";

export const RSSRawModule = new Module('rss-raw', {
    providers: [RawService],
    controllers: [RawController]
});
