import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    AffiliateNetworksContract
} from "./affiliate-networks.contract";

@Contract({
    namespace: 'Affiliate',
    controllerName: 'AffiliateAccounts',
    controllerCustomPath: 'affiliate/accounts',
    protoPackage: 'affiliate',
    subPath: '/affiliate',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "affiliate_accounts",
        databaseTimestamps: true
    }
})
export class AffiliateAccountsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true,
    })
    label!: string;

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
        protoType: 'text',
        nullable: true,
    })
    metadata!: string;
}
