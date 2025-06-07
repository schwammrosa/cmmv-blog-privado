export * from "./api"
export * from "./admin";

import { SpecialDatesModule } from "./api/special-dates.module";
import * as admin from "./admin/index";
import * as contracts from "./contracts/index";

export default {
    name: '@cmmv/special-dates',
    version: '0.0.1',
    description: 'Special dates package for CMMV',
    api: SpecialDatesModule,
    contracts,
    admin,
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/auth",
        "@cmmv/blog"
    ]
} 