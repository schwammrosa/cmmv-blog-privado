import { Module } from '@cmmv/core';
import { BlogStorageService } from "./storage.service";

export const StorageModule = new Module('blog_storage', {
    providers: [BlogStorageService]
});
