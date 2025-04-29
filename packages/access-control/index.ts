import { AccessControlModule } from "./api/access-control.module";
export * from "./api/access-control.module";

export default {
    name: '@cmmv/access-control',
    version: '0.0.1',
    description: 'Access Control package for CMMV',
    api: AccessControlModule,
    dependencies: []
}