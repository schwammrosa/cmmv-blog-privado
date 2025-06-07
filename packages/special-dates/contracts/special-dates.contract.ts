import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'SpecialDates',
    controllerName: 'SpecialDates',
    controllerCustomPath: 'special-dates',
    protoPackage: 'special-dates',
    subPath: '/special-dates',
    generateController: true,
    generateBoilerplates: false,
    auth: false,
    options: {
        moduleContract: true,
        databaseSchemaName: "special_dates",
        databaseTimestamps: true
    }
})
export class SpecialDatesContract extends AbstractContract {
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
        index: true
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