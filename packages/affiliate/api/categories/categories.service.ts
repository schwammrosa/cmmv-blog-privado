import {
    Service
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

@Service()
export class CategoriesServiceTools {

    /**
     * Get all coupons for a campaign
     * @param campaignId The ID of the campaign to get coupons for
     * @returns Array of coupon objects
     */
    async getCategories() {
        const CategoriesEntity = Repository.getEntity("AffiliateCategoriesEntity");

        const categories = await Repository.findAll(CategoriesEntity, {
            limit: 100,
            active: true
        }, [], {
            order: {
                name: "ASC"
            }
        });

        return (categories) ? categories.data : [];
    }
}
