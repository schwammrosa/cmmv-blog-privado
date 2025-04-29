import { Module } from '@cmmv/core';
import { GeminiService } from "./gemini.service";

export const GeminiModule = new Module('ai-content-gemini', {
    providers: [GeminiService]
});
