import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'AffiliateSpecialDates',
    controllerName: 'AffiliateSpecialDates',
    controllerCustomPath: 'affiliate/special-dates',
    protoPackage: 'affiliate',
    subPath: '/affiliate',
    generateController: true,
    generateBoilerplates: false,
    auth: false,
    options: {
        moduleContract: true,
        databaseSchemaName: "affiliate_special_dates",
        databaseTimestamps: true
    }
})
export class AffiliateSpecialDatesContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    name: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    description: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
        index: true,
        unique: true
    })
    slug!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    image?: string;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        defaultValue: true,
        index: true
    })
    active!: boolean;
}