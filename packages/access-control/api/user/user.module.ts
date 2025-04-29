import { Module } from '@cmmv/core';

import { UserBlogController } from './user.controller';
import { UserBlogService } from './user.service';

export const UserBlogModule = new Module('blog_user', {
    controllers: [UserBlogController],
    providers: [UserBlogService]
});
