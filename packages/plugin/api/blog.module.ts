import { Module } from '@cmmv/core';

import { AuthorsModule } from './authors/authors.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.modules';
import { CommentsModule } from './comments/comments.module';
import { MembersModule } from './members/members.module';
import { SettingsModule } from './settings/settings.module';
import { ProfileModule } from './profile/profile.module';
import { MediasModule } from './medias/medias.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ImportsModule } from './imports/imports.module';
import { RedirectsModule } from './redirects/redirects.module';
import { FeedModule } from './feed/feed.modules';
import { ImagesModule } from './images/images.modules';
import { ThemesModule } from './themes/themes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AutopostModule } from './autopost/autopost.module';
import { WhitelabelModule } from './whitelabel/whitelabel.modules';

export const BlogModule = new Module('blog', {
    submodules: [
        AuthorsModule,
        PostsModule,
        CategoriesModule,
        CommentsModule,
        MembersModule,
        SettingsModule,
        ProfileModule,
        MediasModule,
        SitemapModule,
        AnalyticsModule,
        ImportsModule,
        RedirectsModule,
        FeedModule,
        ImagesModule,
        ThemesModule,
        NotificationsModule,
        AutopostModule,
        WhitelabelModule
    ]
});
