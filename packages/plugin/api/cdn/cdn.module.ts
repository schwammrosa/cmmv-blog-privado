import { Module } from '@cmmv/core';

import { CDNService } from "./cdn.service";

export const CDNModule = new Module('cdn', {
    providers: [CDNService]
});
