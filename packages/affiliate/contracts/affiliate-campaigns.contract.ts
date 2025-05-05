import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    AffiliateNetworksContract
} from "./affiliate-networks.contract";

@Contract({
    namespace: 'Affiliate',
    controllerName: 'AffiliateCampaigns',
    controllerCustomPath: 'affiliate/campaigns',
    protoPackage: 'affiliate',
    subPath: '/affiliate',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "affiliate_campaigns",
        databaseTimestamps: true
    }
})
export class AffiliateCampaignsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true,
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    url!: string;

    @ContractField({
        protoType: 'text',
        nullable: true,
    })
    logo!: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
    })
    description!: string;

    @ContractField({
        protoType: 'string',
        objectType: 'string',
        entityType: 'AffiliateNetworksEntity',
        protoRepeated: false,
        nullable: true,
        modelName: 'AffiliateNetworks',
        readOnly: true,
        link: [
            {
                createRelationship: true,
                contract: AffiliateNetworksContract,
                entityName: 'networks',
                field: 'id',
                array: true,
            },
        ],
    })
    network!: string;

    @ContractField({
        protoType: 'string',
        defaultValue: '[]',
        objectType: 'string',
        entityType: 'simple-array',
        protoRepeated: true,
        nullable: true,
        readOnly: true,
    })
    domains!: Array<string>;

    @ContractField({
        protoType: 'text',
        nullable: true,
    })
    metadata!: string;
}
