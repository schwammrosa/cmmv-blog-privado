import "./config";

import { Application, EventsService } from "@cmmv/core";
import { AuthModule } from "@cmmv/auth";
import { DefaultAdapter, DefaultHTTPModule } from "@cmmv/http";
import { RepositoryModule, Repository } from "@cmmv/repository";
import { BlogModule } from "@cmmv/blog";
import { AccessControlModule } from "@cmmv/access-control";
import { RSSAggregationModule } from "@cmmv/rss-aggregation";
import { YTAggregationModule } from "@cmmv/yt-aggregation";
import { AIContentModule } from "@cmmv/ai-content";

Application.create({
    httpAdapter: DefaultAdapter,
    modules: [
        DefaultHTTPModule,
        RepositoryModule,
        AuthModule,
        BlogModule,
        AccessControlModule,
        RSSAggregationModule,
        YTAggregationModule,
        AIContentModule
    ],
    providers: [
        Repository,
        EventsService
    ]
});
