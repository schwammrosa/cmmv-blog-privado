import { Module } from '@cmmv/core';
import { DeepSeekService } from './deepseek.service';

export const DeepSeekModule = new Module('ai-content-deepseek', {
    providers: [DeepSeekService]
});
