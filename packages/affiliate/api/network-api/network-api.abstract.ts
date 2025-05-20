export abstract class NetworkApiAbstract {
    abstract getCampaigns(urlApi: string): Promise<any>;
    abstract getCoupons(urlApi: string): Promise<any>;
    abstract getDeeplink(urlApi: string): Promise<any>;

    /**
     * Resolve the shortened URL
     * @param shortenedUrl
     * @returns
     */
    public async resolveShortenedUrl(shortenedUrl: string, removeQueryParams: boolean = true): Promise<string> {
        try {
            const response = await fetch(shortenedUrl, {
                method: 'GET',
                redirect: 'manual'
            });

            if (response.status === 301 || response.status === 302) {
                const redirectUrl = response.headers.get('location');

                if (redirectUrl && removeQueryParams) {
                    const parsedUrl = new URL(redirectUrl);
                    const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
                    return cleanUrl;
                }
                else{
                    return redirectUrl || "";
                }
            }

            return shortenedUrl;
        } catch (error) {
            console.error('Error resolving shortened URL:', error);
            return shortenedUrl;
        }
    }
}