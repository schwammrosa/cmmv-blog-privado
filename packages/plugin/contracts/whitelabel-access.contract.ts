import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    UserContract
} from "@cmmv/auth";

import {
    WhitelabelContract
} from "./whitelabel.contract";

@Contract({
    namespace: 'WhitelabelAccess',
    controllerName: 'WhitelabelAccess',
    controllerCustomPath: 'whitelabel-access',
    protoPackage: 'whitelabel-access',
    subPath: '/whitelabel-access',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "whitelabel_access",
        databaseTimestamps: true
    }
})
export class WhitelabelAccessContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        objectType: 'object',
        entityType: 'UserEntity',
        protoRepeated: false,
        nullable: false,
        index: true,
        readOnly: true,
        resolver: 'whitelabel-user',
        link: [
            {
                createRelationship: true,
                contract: UserContract,
                contractName: 'UserContract',
                entityName: 'user',
                field: 'id',
            },
        ],
    })
    user: string;

    @ContractField({
        protoType: 'string',
        objectType: 'object',
        entityType: 'WhitelabelEntity',
        protoRepeated: false,
        nullable: false,
        index: true,
        readOnly: true,
        resolver: 'whitelabel-whitelabel',
        link: [
            {
                createRelationship: true,
                contract: WhitelabelContract,
                contractName: 'WhitelabelContract',
                entityName: 'whitelabel',
                field: 'id',
            },
        ],
    })
    whitelabel: string;
}