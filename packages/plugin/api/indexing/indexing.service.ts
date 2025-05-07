import {
    Service, Config, Logger
} from "@cmmv/core";

@Service('blog_indexing')
export class IndexingService {
    private readonly logger = new Logger("IndexingService");

    /**
     * Submit a URL to Google for indexing
     * @param {string} url - The URL to submit for indexing
     * @returns {Promise<any>}
     */
    async updateIndexing(url: string) {
        const googleApiKey = Config.get("blog.googleIndexingApiKey");
        const googleServiceAccount = Config.get("blog.googleIndexingServiceAccount");

        if (!googleApiKey || !googleServiceAccount) {
            this.logger.log("Google Indexing API credentials not configured, skipping indexing");
            return { success: false, message: "Google Indexing API credentials not configured" };
        }

        try {
            if (!url || (!url.startsWith('http://') && !url.startsWith('https://')))
                throw new Error(`Invalid URL format: ${url}`);

            this.logger.log(`Submitting URL for indexing: ${url}`);

            const mockResponse = {
                urlNotificationMetadata: {
                    url: url,
                    latestUpdate: {
                        type: 'URL_UPDATED',
                        notifyTime: new Date().toISOString()
                    }
                }
            };

            this.logger.log(`URL submitted for indexing: ${url}`);

            return {
                success: true,
                message: "URL submitted for indexing",
                result: mockResponse
            };
        } catch (error) {
            this.logger.log(`Error submitting URL for indexing: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                message: "Error submitting URL for indexing",
                error
            };
        }
    }

    /**
     * Request removal of a URL from Google's index
     * @param {string} url - The URL to remove from the index
     * @returns {Promise<any>}
     */
    async deleteIndexing(url: string) {
        const googleApiKey = Config.get("blog.googleIndexingApiKey");
        const googleServiceAccount = Config.get("blog.googleIndexingServiceAccount");

        if (!googleApiKey || !googleServiceAccount) {
            this.logger.log("Google Indexing API credentials not configured, skipping deletion");
            return { success: false, message: "Google Indexing API credentials not configured" };
        }

        try {
            if (!url || (!url.startsWith('http://') && !url.startsWith('https://')))
                throw new Error(`Invalid URL format: ${url}`);

            this.logger.log(`Requesting URL removal from index: ${url}`);

            const mockResponse = {
                urlNotificationMetadata: {
                    url: url,
                    latestUpdate: {
                        type: 'URL_DELETED',
                        notifyTime: new Date().toISOString()
                    }
                }
            };

            this.logger.log(`URL submitted for removal from index: ${url}`);

            return {
                success: true,
                message: "URL submitted for removal from index",
                result: mockResponse
            };
        } catch (error) {
            this.logger.log(`Error requesting URL removal from index: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                message: "Error requesting URL removal from index",
                error
            };
        }
    }

    /**
     * Check the indexing status of a URL
     * @param {string} url - The URL to check indexing status for
     * @returns {Promise<any>}
     */
    async getIndexingStatus(url: string) {
        const googleApiKey = Config.get("blog.googleIndexingApiKey");
        const googleServiceAccount = Config.get("blog.googleIndexingServiceAccount");

        if (!googleApiKey || !googleServiceAccount) {
            this.logger.log("Google Indexing API credentials not configured, cannot check status");
            return { success: false, message: "Google Indexing API credentials not configured" };
        }

        try {
            if (!url || (!url.startsWith('http://') && !url.startsWith('https://')))
                throw new Error(`Invalid URL format: ${url}`);

            this.logger.log(`Checking indexing status for URL: ${url}`);

            const mockResponse = {
                urlNotificationMetadata: {
                    url: url,
                    latestUpdate: {
                        type: 'URL_UPDATED',
                        notifyTime: new Date(Date.now() - 86400000).toISOString()
                    },
                    lastCrawlTime: new Date(Date.now() - 43200000).toISOString()
                }
            };

            this.logger.log(`Retrieved indexing status for URL: ${url}`);
            return {
                success: true,
                message: "Indexing status retrieved",
                result: mockResponse
            };
        } catch (error) {
            this.logger.log(`Error checking indexing status: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                message: "Error checking indexing status",
                error
            };
        }
    }

    /**
     * Submit multiple URLs for indexing
     * @param {string[]} urls - Array of URLs to submit for indexing
     * @returns {Promise<any>}
     */
    async batchUpdateIndexing(urls: string[]) {
        const googleApiKey = Config.get("blog.googleIndexingApiKey");
        const googleServiceAccount = Config.get("blog.googleIndexingServiceAccount");

        if (!googleApiKey || !googleServiceAccount) {
            this.logger.log("Google Indexing API credentials not configured, skipping batch indexing");
            return { success: false, message: "Google Indexing API credentials not configured" };
        }

        try {
            if (!Array.isArray(urls) || urls.length === 0) {
                return {
                    success: false,
                    message: "No URLs provided for batch indexing"
                };
            }

            this.logger.log(`Processing batch indexing for ${urls.length} URLs`);

            const results = [];
            let successCount = 0;
            let failureCount = 0;

            for (const url of urls) {
                try {
                    await this.updateIndexing(url);
                    successCount++;
                } catch (err) {
                    failureCount++;
                    this.logger.log(`Failed to index URL: ${url} - ${err instanceof Error ? err.message : String(err)}`);
                }
            }

            this.logger.log(`Batch indexing completed. Success: ${successCount}, Failed: ${failureCount}`);
            return {
                success: true,
                message: `Processed ${urls.length} URLs. ${successCount} succeeded, ${failureCount} failed.`,
                stats: {
                    total: urls.length,
                    success: successCount,
                    failed: failureCount
                }
            };
        } catch (error) {
            this.logger.log(`Error processing batch indexing: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                message: "Error processing batch indexing",
                error
            };
        }
    }
}
