import { Module } from '@cmmv/core';
import { ChatGPTService } from "./chatgpt.service";

export const ChatGPTModule = new Module('ai-content-chatgpt', {
    providers: [ChatGPTService]
});
