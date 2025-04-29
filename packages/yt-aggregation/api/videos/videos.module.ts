import { Module } from '@cmmv/core';

import {
    YTVideosServiceAdmin
} from "./videos.service";

import {
    YTVideosController
} from "./videos.controller";

export const YTVideosModule = new Module('yt-videos', {
    controllers: [YTVideosController],
    providers: [YTVideosServiceAdmin]
});
