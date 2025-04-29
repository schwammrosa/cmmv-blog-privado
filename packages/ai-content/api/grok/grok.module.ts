import { Module } from '@cmmv/core';

import {
    GrokService
} from "./grok.service";

export const GrokModule = new Module('ai-content-grok', {
    providers: [GrokService]
});
