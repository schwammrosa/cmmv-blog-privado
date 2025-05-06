import { Service, Application } from "@cmmv/core";
import { Repository } from "@cmmv/repository";

@Service()
export class CampaignsNetworksToolsService {
    async getCampaigns(){
        const AffiliateNetworksEntity = Repository.getEntity("AffiliateNetworksContract");
        /*const affiliateNetworks = await Repository.findAll(AffiliateNetworksEntity, {
            limit: 1000,
        }, { });*/
    }
}
