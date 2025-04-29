import { Module } from '@cmmv/core';

import { AutopostService } from "./autopost.service";

export const AutopostModule = new Module('blog_autopost', {
    providers: [AutopostService]
});
