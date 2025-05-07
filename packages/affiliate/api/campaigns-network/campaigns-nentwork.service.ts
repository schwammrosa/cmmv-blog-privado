import { Service, Application } from "@cmmv/core";
import { Repository } from "@cmmv/repository";

import { AwinService } from "./awin.service";

@Service()
export class CampaignsNetworksToolsService {

    private async formatUrlWithMetadata(url: string, metadata: any){
        for(let key in metadata)
            url = url.replace(`{${key}}`, metadata[key]);

        return url;
    }

    /**
     * Get the APIs supported by the campaigns networks
     * @returns {Object} The APIs supported by the campaigns networks
     */
    async getApisSupported(){
        return {
            "Awin": {
                docs: "https://developer.awin.com/apidocs",
                version: "1.0.0",
                service: () => Application.resolveProvider(AwinService)
            }
        }
    }

    /**
     * Get the network campaigns
     * @returns {Object} The network campaigns
     */
    async getNetworkCampaigns(){
        const AffiliateNetworksEntity = Repository.getEntity("AffiliateNetworksEntity");
        const AffiliateAccountsEntity = Repository.getEntity("AffiliateAccountsEntity");
        const AffiliateCampaignsNetworksEntity = Repository.getEntity("AffiliateCampaignsNetworksEntity");

        const affiliateNetworks = await Repository.findAll(AffiliateNetworksEntity, {
            limit: 1000,
        }, []);

        const affiliateAccounts = await Repository.findAll(AffiliateAccountsEntity, {
            limit: 1000,
        }, []);

        if(affiliateAccounts && affiliateNetworks){
            for(const affiliateAccount of affiliateAccounts.data) {
                const affiliateNetwork = affiliateNetworks.data.find((network: any) => network.id === affiliateAccount.networkId);

                if(!affiliateNetwork)
                    continue;

                const apiLinks = JSON.parse(affiliateNetwork.apiLinks);

                if(apiLinks.campaigns){
                    const formattedUrl = await this.formatUrlWithMetadata(apiLinks.campaigns, JSON.parse(affiliateAccount.metadata));

                    if(affiliateNetwork.apiType !== "Fetch"){
                        const supportedApis = await this.getApisSupported();
                        const service: any = (affiliateNetwork.apiType in supportedApis) ? //@ts-ignore
                            await supportedApis[affiliateNetwork.apiType].service() : null;

                        if(service){
                            const campaigns = await service.getCampaigns(formattedUrl);

                            campaigns.forEach(async (campaign: any) => {
                                const affiliateCampaignsNetwork = await Repository.findOne(AffiliateCampaignsNetworksEntity, {
                                    network: affiliateNetwork.id,
                                    campaignId: campaign.id
                                });

                                if(!affiliateCampaignsNetwork){
                                    await Repository.insert(AffiliateCampaignsNetworksEntity, {
                                        network: affiliateNetwork.id,
                                        campaignId: campaign.id,
                                        name: campaign.name,
                                        active: campaign.active,
                                        currencyCode: campaign.currencyCode,
                                        sector: campaign.sector,
                                        domain: (typeof campaign.domain === "string") ? campaign.domain?.replace("*.", "") : null
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }

        return { success: true };
    }

    /**
     * Get the network coupons
     * @returns {Object} The network coupons
     */
    async getCoupons(){
        const AffiliateNetworksEntity = Repository.getEntity("AffiliateNetworksEntity");
        const AffiliateAccountsEntity = Repository.getEntity("AffiliateAccountsEntity");
        const AffiliateCouponsEntity = Repository.getEntity("AffiliateCouponsEntity");
        const AffiliateCampaignsEntity = Repository.getEntity("AffiliateCampaignsEntity");
        const AffiliateCampaignsNetworksEntity = Repository.getEntity("AffiliateCampaignsNetworksEntity");

        const affiliateNetworks = await Repository.findAll(AffiliateNetworksEntity, {
            limit: 1000,
        }, []);

        const affiliateAccounts = await Repository.findAll(AffiliateAccountsEntity, {
            limit: 1000,
        }, []);

        const affiliateCampaigns = await Repository.findAll(AffiliateCampaignsEntity, {
            limit: 1000,
        }, [], {
            select: ["id", "domain", "name"]
        });

        const affiliateCampaignsNetworks = await Repository.findAll(AffiliateCampaignsNetworksEntity, {
            limit: 1000000,
        }, [], {
            select: ["id", "campaignId", "network", "domain"]
        });

        if(affiliateAccounts && affiliateNetworks && affiliateCampaignsNetworks && affiliateCampaigns){
            for(const affiliateAccount of affiliateAccounts.data) {
                const affiliateNetwork = affiliateNetworks.data.find((network: any) => network.id === affiliateAccount.networkId);

                if(!affiliateNetwork)
                    continue;

                const apiLinks = JSON.parse(affiliateNetwork.apiLinks);

                if(apiLinks.coupons){
                    const formattedUrl = await this.formatUrlWithMetadata(apiLinks.coupons, JSON.parse(affiliateAccount.metadata));

                    if(affiliateNetwork.apiType !== "Fetch"){
                        const supportedApis = await this.getApisSupported();
                        const service: any = (affiliateNetwork.apiType in supportedApis) ? //@ts-ignore
                            await supportedApis[affiliateNetwork.apiType].service() : null;

                        if(service){
                            const coupons = await service.getCoupons(formattedUrl);

                            coupons.forEach(async (coupon: any) => {
                                const affiliateCampaignsNetwork = await Repository.findOne(AffiliateCouponsEntity, {
                                    network: affiliateNetwork.id,
                                    advertiser: coupon.advertiser,
                                    promotionId: coupon.promotionId
                                });

                                const affiliateCampaign = affiliateCampaignsNetworks.data
                                    .find((campaign: any) => (campaign.campaignId === coupon.advertiser || campaign.campaignId === coupon.advertiser.toString()) && campaign.network === affiliateNetwork.id);

                                if(!affiliateCampaignsNetwork && affiliateCampaign){
                                    const affiliateCampaignDomain = affiliateCampaigns.data.find((campaign: any) => campaign.domain === affiliateCampaign.domain);

                                    await Repository.insert(AffiliateCouponsEntity, {
                                        network: affiliateNetwork.id,
                                        advertiser: coupon.advertiser,
                                        promotionId: coupon.promotionId,
                                        title: coupon.title,
                                        description: coupon.description,
                                        code: coupon.code,
                                        active: coupon.active,
                                        expiration: coupon.expiration,
                                        link: coupon.link,
                                        campaign: (affiliateCampaignDomain) ? affiliateCampaignDomain.id : null,
                                        campaignName: (affiliateCampaignDomain) ? affiliateCampaignDomain.name : null
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }

        return { success: true };
    }
}
