import {
    Service, OnEvent,
    Config,
    Logger
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

interface OneSignalNotificationPayload {
    app_id: string;
    included_segments: string[];
    headings: { [language: string]: string };
    contents: { [language: string]: string };
    url?: string;
    chrome_web_image?: string;
    firefox_icon?: string;
    large_icon?: string;
    data?: any;
}

@Service('blog_notifications')
export class NotificationsService {
    public static readonly logger = new Logger(NotificationsService.name);

    @OnEvent("posts.published")
    async onPostPublished(post: any) {
        try {
            await NotificationsService.sendPostPublishedNotification(post);
        } catch (error: any) {
            console.error(`Failed to send notification for published post: ${error?.message || 'Unknown error'}`);
        }
    }

    /**
     * Send a notification to OneSignal for a new post
     * @param post - The post to send the notification for
     */
    static async sendPostPublishedNotification(post: any) {
        const oneSignalEnabled = Config.get<boolean>("blog.oneSignalEnabled", false);
        const notifyOnNewPost = Config.get<boolean>("blog.notifyOnNewPost", false);

        NotificationsService.logger.debug(`OneSignal enabled: ${oneSignalEnabled}, Notify on new post: ${notifyOnNewPost}`);

        if (oneSignalEnabled && notifyOnNewPost) {
            try {
                await NotificationsService.sendPostPublishedNotificationToOneSignal(post);
                NotificationsService.logger.debug(`Successfully sent OneSignal notification for post: ${post.id} - ${post.title}`);
            } catch (error: any) {
                NotificationsService.logger.error(`Failed to send OneSignal notification: ${error?.message || 'Unknown error'}`);
            }
        }
    }

    /**
     * Send a notification to OneSignal for a new post
     * @param post - The post to send the notification for
     * @returns The response from the OneSignal API
     */
    static async sendPostPublishedNotificationToOneSignal(post: any) {
        const oneSignalAppId = Config.get<string>("blog.oneSignalAppId");
        const oneSignalApiKey = Config.get<string>("blog.oneSignalApiKey");
        const siteUrl = Config.get<string>("blog.url") || "";

        if (!oneSignalAppId || !oneSignalApiKey)
            throw new Error("OneSignal configuration is incomplete. App ID and API Key are required.");

        const postUrl = `${siteUrl}/post/${post.slug}`;

        const payload: OneSignalNotificationPayload = {
            app_id: oneSignalAppId,
            included_segments: ["All"],
            headings: {
                en: "New Post Published",
            },
            contents: {
                en: post.title || "Check out our new post!",
            },
            url: postUrl
        };

        if (post.featureImage) {
            payload.chrome_web_image = post.featureImage;
            payload.firefox_icon = post.featureImage;
            payload.large_icon = post.featureImage;
        }

        payload.data = {
            postId: post.id,
            postTitle: post.title,
            postSlug: post.slug,
            type: 'new_post'
        };

        try {
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${oneSignalApiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OneSignal API returned ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            NotificationsService.logger.debug(`OneSignal API response: ${JSON.stringify(data)}`);
            return data;
        } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error';
            NotificationsService.logger.error(`OneSignal API error: ${errorMessage}`);
            throw new Error(`Failed to send OneSignal notification: ${errorMessage}`);
        }
    }

    /**
     * Send a notification to OneSignal for a new comment
     * @param comment - The comment to send the notification for
     * @param post - The post to send the notification for
     */
    async sendNewCommentNotification(comment: any, post: any) {
        const oneSignalEnabled = Config.get<boolean>("blog.oneSignalEnabled", false);
        const notifyOnNewComment = Config.get<boolean>("blog.notifyOnNewComment", false);

        if (oneSignalEnabled && notifyOnNewComment) {
            try {
                await this.sendCommentNotificationToOneSignal(comment, post);
                NotificationsService.logger.debug(`Successfully sent OneSignal notification for comment on post: ${post.id}`);
            } catch (error: any) {
                NotificationsService.logger.error(`Failed to send comment notification: ${error?.message || 'Unknown error'}`);
            }
        }
    }

    /**
     * Send a notification to OneSignal for a new comment
     * @param comment - The comment to send the notification for
     * @param post - The post to send the notification for
     */
    async sendCommentNotificationToOneSignal(comment: any, post: any) {
        const oneSignalAppId = Config.get("blog.oneSignalAppId");
        const oneSignalApiKey = Config.get("blog.oneSignalApiKey");
        const siteUrl = Config.get("blog.url") || "";

        if (!oneSignalAppId || !oneSignalApiKey)
            return;

        const postUrl = `${siteUrl}/post/${post.slug}#comment-${comment.id}`;
        const commenterName = comment.author || 'Anonymous';

        const payload: OneSignalNotificationPayload = {
            app_id: oneSignalAppId,
            included_segments: ["All"],
            headings: {
                en: "New Comment",
            },
            contents: {
                en: `${commenterName} commented on "${post.title}"`
            },
            url: postUrl,
            data: {
                postId: post.id,
                postTitle: post.title,
                commentId: comment.id,
                commentAuthor: comment.author,
                type: 'new_comment'
            }
        };

        try {
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${oneSignalApiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OneSignal API returned ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            NotificationsService.logger.debug(`OneSignal API response: ${JSON.stringify(data)}`);
            return data;
        } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error';
            NotificationsService.logger.error(`OneSignal API error: ${errorMessage}`);
        }
    }
}
