import { Module } from '@cmmv/core';

import { LogsService } from "./logs.service";

export const LogsModule = new Module('logs', {
    providers: [LogsService]
});
