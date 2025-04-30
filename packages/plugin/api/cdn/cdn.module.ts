import { Module } from '@cmmv/core';

import { CDNController } from './cdn.controller';
import { CDNService } from "./cdn.service";

export const CDNModule = new Module('cdn', {
    controllers: [CDNController],
    providers: [CDNService]
});
