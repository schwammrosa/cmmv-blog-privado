import { Module } from '@cmmv/core';

import {
    ChannelsService
} from "./channels.service";

import {
    ChannelsController
} from "./channels.controller";

export const RSSChannelsModule = new Module('rss-channels', {
    providers: [ChannelsService],
    controllers: [ChannelsController]
});
