import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Affiliate',
    controllerName: 'Coupons',
    controllerCustomPath: 'affiliate/coupons',
    protoPackage: 'affiliate',
    subPath: '/affiliate',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "affiliate_coupons",
        databaseTimestamps: true
    }
})
export class AffiliateCouponsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        defaultValue: 'Cupom',
    })
    type!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        defaultValue: 'fixed',
    })
    typeDiscount!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    title!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    description?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    code!: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
        index: true
    })
    network?: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
        index: true
    })
    campaign?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    campaignName?: string;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        defaultValue: true
    })
    active!: boolean;

    @ContractField({
        protoType: 'date',
        nullable: true
    })
    expiration?: Date;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    link?: string;
}
