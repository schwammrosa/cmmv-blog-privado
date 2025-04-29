import { Module } from '@cmmv/core';

import {
    ParserService
} from "./parser.service";

import {
    ParserController
} from "./parser.controller";

export const RSSParserModule = new Module('rss-parser', {
    providers: [ParserService],
    controllers: [ParserController]
});
