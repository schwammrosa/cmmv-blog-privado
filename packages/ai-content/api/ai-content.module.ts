import { Module } from '@cmmv/core';

import { GeminiModule } from "./gemini/gemini.module";
import { ChatGPTModule } from './chatgpt/chatgpt.module';
import { GrokModule } from './grok/grok.module';
import { DeepSeekModule } from './deepseek/deepseek.module';
import { AIContentService } from './ai-content.service';

export const AIContentModule = new Module('ai-content', {
    submodules: [
        GeminiModule,
        ChatGPTModule,
        GrokModule,
        DeepSeekModule
    ],
    providers: [AIContentService]
});
