import {
    Service, OnEvent,
    Config,
    Logger
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import { NotificationsService } from "../notifications/notifications.service";

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

interface SocialPostPayload {
    title: string;
    excerpt: string;
    content: string;
    url: string;
    tags: string[];
    categories: string[];
    author: string;
    featureImage?: string;
    postId: string;
}

@Service('blog_autopost')
export class AutopostService {
    public static readonly logger = new Logger(AutopostService.name);

    @OnEvent("posts.published")
    async onPostPublished(post: any) {
        try {
            await NotificationsService.sendPostPublishedNotification(post);

            const autoPostOnNewContent = Config.get<boolean>("blog.autoPostOnNewContent", false);

            if (autoPostOnNewContent) {
                const isPost = post.type === 'post';
                const isPage = post.type === 'page';
                const sharePostsEnabled = Config.get<boolean>("blog.autoPostSharePosts", true);
                const sharePagesEnabled = Config.get<boolean>("blog.autoPostSharePages", false);

                if ((isPost && sharePostsEnabled) || (isPage && sharePagesEnabled))
                    await this.sendToSocialNetworks(post);
                else
                    AutopostService.logger.debug(`Skipping auto-post for ${post.id} - content type '${post.type}' is not enabled for sharing`);
            } else {
                AutopostService.logger.debug('Auto-posting for new content is disabled');
            }
        } catch (error: any) {
            console.error(`Error in post published handler: ${error?.message || 'Unknown error'}`);
        }
    }

    /**
     * Send post to all configured social networks
     * @param post - The post to send
     * @returns
     */
    public async sendToSocialNetworks(post: any): Promise<void> {
        try {
            const siteUrl = Config.get<string>("blog.url", "");
            const postUrl = `${siteUrl}/post/${post.slug}`;

            const payload: SocialPostPayload = {
                title: post.title || "",
                excerpt: post.excerpt || "",
                content: post.content || "",
                url: postUrl,
                tags: post.tags || [],
                categories: post.categories || [],
                author: post.author?.name || "Anonymous",
                featureImage: post.featureImage,
                postId: post.id
            };

            const delayAutoPosting = Config.get<boolean>("blog.delayAutoPosting", false);

            if (delayAutoPosting) {
                const delayMinutes = Config.get<number>("blog.autoPostDelayMinutes", 0);

                if (delayMinutes > 0) {
                    AutopostService.logger.debug(`Scheduling post to social networks with ${delayMinutes} minute delay`);

                    setTimeout(() => {
                        this.executeAutoPostToNetworks(payload)
                            .catch(err => AutopostService.logger.error(`Error in delayed auto-posting: ${err.message}`));
                    }, delayMinutes * 60 * 1000);

                    return;
                }
            }

            await this.executeAutoPostToNetworks(payload);
        } catch (error: any) {
            AutopostService.logger.error(`Failed to send post to social networks: ${error?.message || 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Execute posting to all configured social networks
     * @param payload - The payload containing post details
     */
    private async executeAutoPostToNetworks(payload: SocialPostPayload): Promise<void> {
        const networks = [
            { name: 'Facebook', enabled: Config.get<boolean>("blog.autoPostFacebook", false), handler: this.postToFacebook.bind(this) },
            { name: 'Twitter', enabled: Config.get<boolean>("blog.autoPostTwitter", false), handler: this.postToTwitter.bind(this) },
            { name: 'LinkedIn', enabled: Config.get<boolean>("blog.autoPostLinkedIn", false), handler: this.postToLinkedIn.bind(this) },
        ];

        if (Config.get<boolean>("blog.enableLinkTracking", false))
            payload.url = this.addUtmParameters(payload.url, payload.postId);

        const timeBetweenPosts = Config.get<number>("blog.timeBetweenPosts", 0);
        let lastPostTime = Date.now();

        for (const network of networks) {
            if (network.enabled) {
                try {
                    if (timeBetweenPosts > 0 && network !== networks[0]) {
                        const elapsedTime = Date.now() - lastPostTime;
                        const waitTime = (timeBetweenPosts * 60 * 1000) - elapsedTime;

                        if (waitTime > 0) {
                            AutopostService.logger.debug(`Waiting ${Math.round(waitTime / 1000)} seconds before posting to ${network.name}`);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                        }
                    }

                    AutopostService.logger.debug(`Posting to ${network.name}...`);
                    await network.handler(payload);
                    AutopostService.logger.debug(`Successfully posted to ${network.name}`);

                    lastPostTime = Date.now();
                } catch (error: any) {
                    AutopostService.logger.error(`Failed to post to ${network.name}: ${error?.message || 'Unknown error'}`);
                }
            } else {
                AutopostService.logger.debug(`Skipping ${network.name} (disabled)`);
            }
        }
    }

    /**
     * Add UTM tracking parameters to the URL
     * @param url - The URL to add UTM parameters to
     * @param postId - The ID of the post
     * @returns The URL with UTM parameters
     */
    private addUtmParameters(url: string, postId: string): string {
        try {
            const utmSource = Config.get<string>("blog.utmSource", "{network}");
            const utmMedium = Config.get<string>("blog.utmMedium", "social");
            const utmCampaign = Config.get<string>("blog.utmCampaign", "auto-post");
            const utmContent = Config.get<string>("blog.utmContent", "{post_id}");

            const urlObj = new URL(url);

            urlObj.searchParams.append('utm_source', utmSource);
            urlObj.searchParams.append('utm_medium', utmMedium);
            urlObj.searchParams.append('utm_campaign', utmCampaign);
            urlObj.searchParams.append('utm_content', utmContent.replace('{post_id}', postId));

            return urlObj.toString();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            AutopostService.logger.error(`Error adding UTM parameters: ${errorMessage}`);
            return url;
        }
    }

    /**
     * Format post message with template
     * @param payload - The payload containing post details
     * @param template - The template to use for formatting the message
     * @returns The formatted message
     */
    private formatPostMessage(payload: SocialPostPayload, template: string): string {
        let message = template || 'New post: {title} {url}';

        message = message.replace('{title}', payload.title);
        message = message.replace('{excerpt}', payload.excerpt);
        message = message.replace('{url}', payload.url);
        message = message.replace('{author}', payload.author);

        const tagsStr = Array.isArray(payload.tags) ? payload.tags.join(', ') : '';
        const categoriesStr = Array.isArray(payload.categories) ? payload.categories.join(', ') : '';

        message = message.replace('{tags}', tagsStr);
        message = message.replace('{categories}', categoriesStr);

        return message;
    }

    /**
     * Post to Facebook
     * @param payload - The payload containing post details
     * @returns
     */
    private async postToFacebook(payload: SocialPostPayload): Promise<void> {
        const pageId = Config.get<string>("blog.facebookPageId");
        const accessToken = Config.get<string>("blog.facebookAccessToken");
        const postFormat = Config.get<string>("blog.facebookPostFormat");
        const includeImage = Config.get<boolean>("blog.facebookIncludeImage", false);

        if (!pageId || !accessToken)
            throw new Error("Facebook configuration is incomplete. Page ID and Access Token are required.");

        const message = this.formatPostMessage(payload, postFormat);

        let postUrl = payload.url;
        if (postUrl.includes('utm_source={network}'))
            postUrl = postUrl.replace('utm_source={network}', 'utm_source=facebook');

        const requestData: any = {
            message: message,
            link: postUrl
        };

        try {
            const apiUrl = `https://graph.facebook.com/v18.0/${pageId}/feed`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...requestData,
                    access_token: accessToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Facebook API error: ${errorData?.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return;
        } catch (error: any) {
            throw new Error(`Failed to post to Facebook: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Post to Twitter
     * @param payload - The payload containing post details
     */
    private async postToTwitter(payload: SocialPostPayload): Promise<void> {
        const apiKey = Config.get<string>("blog.twitterApiKey");
        const apiSecret = Config.get<string>("blog.twitterApiSecret");
        const accessToken = Config.get<string>("blog.twitterAccessToken");
        const accessTokenSecret = Config.get<string>("blog.twitterAccessTokenSecret");
        const postFormat = Config.get<string>("blog.twitterPostFormat");
        const includeImage = Config.get<boolean>("blog.twitterIncludeImage", false);

        if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret)
            throw new Error("Twitter configuration is incomplete. API keys and access tokens are required.");

        const message = this.formatPostMessage(payload, postFormat);

        let postUrl = payload.url;

        if (postUrl.includes('utm_source={network}'))
            postUrl = postUrl.replace('utm_source={network}', 'utm_source=twitter');

        try {
            const crypto = require('crypto');
            const oauth = {
                consumer_key: apiKey,
                consumer_secret: apiSecret,
                token: accessToken,
                token_secret: accessTokenSecret
            };

            const nowTimestamp = Math.floor(Date.now() / 1000);
            const oauthNonce = crypto.randomBytes(16).toString('hex');

            const parameterString = [
                'oauth_consumer_key=' + encodeURIComponent(oauth.consumer_key),
                'oauth_nonce=' + encodeURIComponent(oauthNonce),
                'oauth_signature_method=HMAC-SHA1',
                'oauth_timestamp=' + nowTimestamp,
                'oauth_token=' + encodeURIComponent(oauth.token),
                'oauth_version=1.0'
            ].sort().join('&');

            const method = 'POST';
            const baseUrl = 'https://api.twitter.com/2/tweets';
            const signatureBase = method + '&' + encodeURIComponent(baseUrl) + '&' + encodeURIComponent(parameterString);
            const signingKey = encodeURIComponent(oauth.consumer_secret) + '&' + encodeURIComponent(oauth.token_secret);
            const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');

            const authHeader = 'OAuth ' + [
                'oauth_consumer_key="' + encodeURIComponent(oauth.consumer_key) + '"',
                'oauth_nonce="' + encodeURIComponent(oauthNonce) + '"',
                'oauth_signature="' + encodeURIComponent(signature) + '"',
                'oauth_signature_method="HMAC-SHA1"',
                'oauth_timestamp="' + nowTimestamp + '"',
                'oauth_token="' + encodeURIComponent(oauth.token) + '"',
                'oauth_version="1.0"'
            ].join(', ');

            let tweetText = message;

            if (tweetText.length > 280)
                tweetText = tweetText.substring(0, 277) + '...';

            const tweetData = {
                text: tweetText
            };

            const response = await fetch('https://api.twitter.com/2/tweets', {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tweetData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Twitter API error: ${errorData?.detail || response.statusText}`);
            }

            const data = await response.json();
            AutopostService.logger.debug(`Twitter API response: ${JSON.stringify(data)}`);
            return;
        } catch (error: any) {
            throw new Error(`Failed to post to Twitter: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Post to LinkedIn
     * @param payload - The payload containing post details
     * @returns
     */
    private async postToLinkedIn(payload: SocialPostPayload): Promise<void> {
        const accessToken = Config.get<string>("blog.linkedInAccessToken");
        const postFormat = Config.get<string>("blog.linkedInPostFormat");
        const includeImage = Config.get<boolean>("blog.linkedInIncludeImage", false);

        if (!accessToken)
            throw new Error("LinkedIn configuration is incomplete. Access token is required.");

        const message = this.formatPostMessage(payload, postFormat);

        let postUrl = payload.url;

        if (postUrl.includes('utm_source={network}'))
            postUrl = postUrl.replace('utm_source={network}', 'utm_source=linkedin');

        try {
            const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!profileResponse.ok) {
                const errorData = await profileResponse.json();
                throw new Error(`LinkedIn API error getting profile: ${errorData?.message || profileResponse.statusText}`);
            }

            const profileData = await profileResponse.json();
            const personUrn = profileData.id ? `urn:li:person:${profileData.id}` : null;

            if (!personUrn) {
                throw new Error('Could not retrieve LinkedIn profile URN');
            }

            const shareData = {
                author: personUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: message
                        },
                        shareMediaCategory: 'ARTICLE',
                        media: [{
                            status: 'READY',
                            description: {
                                text: payload.excerpt || payload.title
                            },
                            originalUrl: postUrl,
                            title: {
                                text: payload.title
                            }
                        }]
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };

            if (includeImage && payload.featureImage) {
                const mediaWithThumbnail = shareData.specificContent['com.linkedin.ugc.ShareContent'].media[0] as any;
                mediaWithThumbnail.thumbnails = [{
                    url: payload.featureImage
                }];
            }

            const shareResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                },
                body: JSON.stringify(shareData)
            });

            if (!shareResponse.ok) {
                const errorData = await shareResponse.json();
                throw new Error(`LinkedIn API error posting: ${errorData?.message || shareResponse.statusText}`);
            }

            const data = await shareResponse.json();
            AutopostService.logger.debug(`LinkedIn API response: ${JSON.stringify(data)}`);
            return;
        } catch (error: any) {
            throw new Error(`Failed to post to LinkedIn: ${error.message || 'Unknown error'}`);
        }
    }
}
