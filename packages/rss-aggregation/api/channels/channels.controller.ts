import {
    Controller, Get, RouterSchema,
    Queries, Req, Param,
    CacheControl, ContentType, Raw
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    ChannelsService
} from "./channels.service";

@Controller("feed/channels")
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService){}

    @Get("processFeeds", {exclude: true })
    @Auth({ rootOnly: true})
    async processFeeds() {
        return await this.channelsService.processFeeds(true);
    }

    @Get("processFeed/:channelId", {exclude: true })
    @Auth({ rootOnly: true})
    async processFeed(@Param("channelId") channelId: string) {
        return await this.channelsService.processFeed(channelId);
    }
}
