import { Module } from '@cmmv/core';

import {
    GroqService
} from "./groq.service";

export const GroqModule = new Module('ai-content-groq', {
    providers: [GroqService]
}); 