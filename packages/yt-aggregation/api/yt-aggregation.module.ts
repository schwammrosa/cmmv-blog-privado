import { Module } from '@cmmv/core';

import {
    YTChannelsContract,
    YTVideosContract
} from '../contracts';

import { YTChannelsModule } from './channels/channels.module';
import { YTVideosModule } from './videos/videos.module';

export const YTAggregationModule = new Module('yt-aggregation', {
    contracts: [
        YTChannelsContract,
        YTVideosContract
    ],
    submodules: [
        YTChannelsModule,
        YTVideosModule
    ]
});
