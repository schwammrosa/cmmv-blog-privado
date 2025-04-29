import { Module } from '@cmmv/core';

import { UserBlogController } from "./user/user.controller";
import { UserBlogService } from "./user/user.service";
import { UserBlogModule } from './user/user.module';

export const AccessControlModule = new Module('access-control', {
    controllers: [UserBlogController],
    providers: [UserBlogService],
    submodules: [UserBlogModule]
});
