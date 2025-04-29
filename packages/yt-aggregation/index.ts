export * from "./admin";
export * from "./contracts";

import { YTAggregationModule } from "./api/yt-aggregation.module";
import * as admin from "./admin/index";
import * as contracts from "./contracts/index";

export default {
    name: '@cmmv/yt-aggregation',
    version: '0.0.1',
    description: 'Youtube Aggregation package for CMMV',
    api: YTAggregationModule,
    contracts,
    admin,
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/auth",
        "@cmmv/blog",
    ]
}
