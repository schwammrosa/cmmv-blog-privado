import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Prompts',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_prompts",
        databaseTimestamps: true
    }
})
export class PromptsContract extends AbstractContract {
    @ContractField({
        protoType: 'text',
        nullable: false,
        index: true
    })
    prompt!: string;

    @ContractField({
        protoType: 'float',
        nullable: false,
        index: true
    })
    temperature!: number;

    @ContractField({
        protoType: 'float',
        nullable: false,
        index: true
    })
    topP!: number;

    @ContractField({
        protoType: 'int32',
        nullable: false,
        index: true
    })
    maxTokens!: number;

    @ContractField({
        protoType: 'int32',
        nullable: false,
        defaultValue: 5,
        index: true
    })
    relevance!: number;
}
