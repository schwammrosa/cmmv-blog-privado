import "./config";

import { Application, EventsService } from "@cmmv/core";
import { AuthModule } from "@cmmv/auth";
import { DefaultAdapter, DefaultHTTPModule } from "@cmmv/http";
import { RepositoryModule, Repository } from "@cmmv/repository";
import { OpenAPIModule } from "@cmmv/openapi";
import { SandboxModule } from "@cmmv/sandbox";
import { BlogModule } from "@cmmv/blog";
import { AccessControlModule } from "@cmmv/access-control";
import { RSSAggregationModule } from "@cmmv/rss-aggregation";
import { YTAggregationModule } from "@cmmv/yt-aggregation";
import { AIContentModule } from "@cmmv/ai-content";
import { AffiliateModule } from "@cmmv/affiliate";
import { OddsModule } from "@cmmv/odds";

Application.create({
    httpAdapter: DefaultAdapter,
    modules: [
        DefaultHTTPModule,
        RepositoryModule,
        AuthModule,
        OpenAPIModule,
        SandboxModule,
        BlogModule,
        AccessControlModule,
        RSSAggregationModule,
        YTAggregationModule,
        AIContentModule,
        AffiliateModule,
        OddsModule
    ],
    providers: [
        Repository,
        EventsService
    ]
});
