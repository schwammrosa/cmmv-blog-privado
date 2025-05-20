import {
    Controller, Get, Param,
    Query
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    YTChannelsServiceAdmin
} from "./channels.service";

@Controller("ytfeed/channels")
export class YTChannelsController {
    constructor(private readonly ytChannelsService: YTChannelsServiceAdmin){}

    @Get("processChannels", {exclude: true })
    @Auth("ytchannels:get")
    async processChannels() {
        return await this.ytChannelsService.processChannels(true);
    }

    @Get("processChannel/:channelId", {exclude: true })
    @Auth("ytchannels:get")
    async processChannel(@Param("channelId") channelId: string) {
        return await this.ytChannelsService.processChannel(channelId);
    }

    @Get("getChannelInfo", {exclude: true })
    @Auth("ytchannels:get")
    async getChannelInfo(@Query("u") channelUrl: string) {
        return await this.ytChannelsService.getChannelInfoFromUrl(decodeURIComponent(channelUrl));
    }
}
