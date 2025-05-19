export abstract class NetworkApiAbstract {
    abstract getCampaigns(urlApi: string): Promise<any>;
    abstract getCoupons(urlApi: string): Promise<any>;
}