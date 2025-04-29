import { Module } from '@cmmv/core';

import {
    YTChannelsServiceAdmin
} from "./channels.service";

import {
    YTChannelsController
} from "./channels.controller";

export const YTChannelsModule = new Module('yt-channels', {
    controllers: [YTChannelsController],
    providers: [YTChannelsServiceAdmin]
});
