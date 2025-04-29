import { Module } from '@cmmv/core';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from "./notifications.service";

export const NotificationsModule = new Module('blog_notifications', {
    controllers: [NotificationsController],
    providers: [NotificationsService]
});
