import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Whitelabel',
    controllerName: 'Whitelabel',
    protoPackage: 'whitelabel',
    subPath: '/whitelabel',
    generateController: false,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "whitelabel"
    }
})
export class WhitelabelContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    apiUrl!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    faviconUrl!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    domain!: string;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        index: true,
        defaultValue: false
    })
    root!: boolean;
}