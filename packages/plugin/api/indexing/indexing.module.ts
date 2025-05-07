import { Module } from '@cmmv/core';

import { IndexingService } from "./indexing.service";

export const IndexingModule = new Module('indexing', {
    providers: [IndexingService]
});
