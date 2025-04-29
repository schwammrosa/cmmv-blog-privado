import {
    Contract, AbstractContract,
    ContractField, ContractMessage,
    ContractService
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Themes',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_themes",
        databaseTimestamps: true
    }
})
export class ThemesContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    description!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    author?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    version?: string;

    @ContractField({
        protoType: 'text',
        nullable: true
    })
    preview?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    url?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    repository?: string;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        defaultValue: false,
        index: true
    })
    installed!: boolean;

    @ContractField({
        protoType: 'datetime',
        nullable: true
    })
    lastCheck?: Date;
}
