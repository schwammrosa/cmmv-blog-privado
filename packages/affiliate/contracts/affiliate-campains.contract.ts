import {
    Contract, AbstractContract,
    ContractField, ContractMessage,
    ContractService
} from "@cmmv/core";

import { AffiliateNetworksContract } from "./affiliate-networks.contract";

@Contract({
    namespace: 'Affiliate',
    controllerName: 'Campains',
    controllerCustomPath: 'affiliate/campains',
    protoPackage: 'affiliate',
    subPath: '/affiliate',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "affiliate_campains",
        databaseTimestamps: true
    }
})
export class AffiliateCampainsContract extends AbstractContract {
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
        protoType: 'string',
        nullable: false,
    })
    logo!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    description!: string;

    @ContractField({
        protoType: 'string',
        objectType: 'object',
        entityType: 'NetworksEntity',
        protoRepeated: true,
        nullable: true,
        modelName: 'Networks',
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
    networks!: Array<string>;

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
}
