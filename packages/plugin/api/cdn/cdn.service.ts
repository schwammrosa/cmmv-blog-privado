import {
    Service, Config, Logger
} from "@cmmv/core";

@Service('blog_cdn')
export class CDNService {
    private readonly logger = new Logger("CDNService");

    /**
     * Clear the CDN cache
     * @param {string[]} urls - Optional specific URLs to purge (empty for all)
     * @returns {Promise<any>}
     */
    async clearCDNCache(urls?: string[]) {
        const cloudflareResult = await this.clearCloudflareCache(urls);
        const cloudfrontResult = await this.clearCloudfrontCache(urls);

        return {
            cloudflare: cloudflareResult,
            cloudfront: cloudfrontResult
        };
    }

    /**
     * Clear Cloudflare cache for the entire site or specific URLs
     * @param {string[]} urls - Optional specific URLs to purge (empty for all)
     * @returns {Promise<any>}
     */
    async clearCloudflareCache(urls?: string[]) {
        const cloudflareToken = Config.get("blog.cloudflareToken");
        const cloudflareZoneId = Config.get("blog.cloudflareZoneId");

        if (!cloudflareToken || !cloudflareZoneId) {
            this.logger.log("Cloudflare credentials not configured, skipping cache purge");
            return { success: false, message: "Cloudflare credentials not configured" };
        }

        try {
            const apiUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache`;

            const body = urls && urls.length > 0
                ? { files: urls }
                : { purge_everything: true };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cloudflareToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) {
                this.logger.log(`Cloudflare cache purge failed: ${JSON.stringify(result)}`);
                return {
                    success: false,
                    message: "Failed to purge Cloudflare cache",
                    error: result
                };
            }

            this.logger.log(`Cloudflare cache purged successfully: ${JSON.stringify(result)}`);
            return {
                success: true,
                message: urls && urls.length > 0
                    ? `Purged cache for ${urls.length} URLs`
                    : "Purged all cache",
                result
            };
        } catch (error) {
            this.logger.log(`Error purging Cloudflare cache: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                message: "Error purging Cloudflare cache",
                error
            };
        }
    }

    /**
     * Clear AWS CloudFront cache for specific paths or all content
     * @param {string[]} urls - Optional specific URLs to purge (empty for all)
     * @returns {Promise<any>}
     */
    async clearCloudfrontCache(urls?: string[]) {
        const cloudfrontAccessKey = Config.get("blog.cloudfrontAccessKey");
        const cloudfrontSecretKey = Config.get("blog.cloudfrontSecretKey");
        const cloudfrontDistributionId = Config.get("blog.cloudfrontDistributionId");
        const cloudfrontRegion = Config.get("blog.cloudfrontRegion") || "us-east-1";

        if (!cloudfrontAccessKey || !cloudfrontSecretKey || !cloudfrontDistributionId) {
            this.logger.log("CloudFront credentials not configured, skipping cache purge");
            return { success: false, message: "CloudFront credentials not configured" };
        }

        try {
            let paths: string[] = [];

            if (urls && urls.length > 0) {
                paths = urls.map(url => {
                    try {
                        const urlObj = new URL(url);
                        return urlObj.pathname;
                    } catch (e) {
                        return url.startsWith('/') ? url : `/${url}`;
                    }
                });
            } else {
                paths = ['/*'];
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '');
            const reference = `invalidation-${timestamp}`;
            const date = new Date().toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
            const amzDate = date;
            const dateStamp = date.substring(0, 8);

            const method = 'POST';
            const service = 'cloudfront';
            const host = `cloudfront.${cloudfrontRegion}.amazonaws.com`;
            const endpoint = `https://${host}/2020-05-31/distribution/${cloudfrontDistributionId}/invalidation`;

            const requestBody = JSON.stringify({
                DistributionId: cloudfrontDistributionId,
                InvalidationBatch: {
                    Paths: {
                        Quantity: paths.length,
                        Items: paths
                    },
                    CallerReference: reference
                }
            });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Amz-Date': amzDate,
                    'X-Amz-Content-Sha256': 'calculated-hash',
                    'Authorization': `AWS4-HMAC-SHA256 Credential=${cloudfrontAccessKey}/${dateStamp}/${cloudfrontRegion}/${service}/aws4_request, SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date, Signature=calculated-signature` // Would need proper implementation
                },
                body: requestBody
            });

            this.logger.log("IMPORTANT: Complete CloudFront implementation requires AWS SDK for proper request signing");
            this.logger.log("Current implementation is a placeholder - use AWS SDK in production");

            if (response.ok) {
                const result = await response.json();
                return {
                    success: true,
                    message: `CloudFront invalidation created for ${paths.length} paths`,
                    result
                };
            } else {
                const error = await response.text();
                return {
                    success: false,
                    message: "Failed to create CloudFront invalidation",
                    error
                };
            }
        } catch (error) {
            this.logger.log(`Error purging CloudFront cache: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                message: "Error purging CloudFront cache",
                error
            };
        }
    }
}
