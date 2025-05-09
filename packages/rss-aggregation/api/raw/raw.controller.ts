import {
    Controller, Get, Param,
    Put, Body, Queries, Response, Query, Post
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    RawService
} from "./raw.service";

@Controller("feed/raw")
export class RawController {
    constructor(private readonly rawService: RawService){}

    @Get("getRaws", {exclude: true })
    @Auth()
    async getRaws(@Queries() queries: any) {
        return await this.rawService.getRaws(queries);
    }

    @Post("getAIRaw/:id", {exclude: true })
    @Auth()
    async getAIRaw(@Param("id") id: string, @Body() data?: any) {
        return await this.rawService.getAIRaw(id, data?.content);
    }

    @Put("updateRaw/:id", {exclude: true })
    @Auth()
    async updateRaw(@Param("id") id: string, @Body() data: any) {
        return await this.rawService.updateRaw(id, data);
    }

    @Put("rejectRaw/:id", {exclude: true })
    @Auth()
    async rejectRaw(@Param("id") id: string) {
        return await this.rawService.rejectRaw(id);
    }

    @Get("imageProxy", {exclude: true })
    @Auth()
    async imageProxy(@Query("url") url: string, @Response() res: Response) {
        return await this.rawService.proxyImage(url, res);
    }

    @Get("cleanAllRaws", {exclude: true })
    @Auth()
    async cleanAllRaws() {
        return await this.rawService.cleanAllRaws();
    }

    @Get("cleanChannelRaws/:channelId", {exclude: true })
    @Auth()
    async cleanChannelRaws(
        @Param("channelId") channelId: string
    ) {
        return await this.rawService.cleanChannelRaws(channelId);
    }

    @Post("reprocess/:id", {exclude: true })
    @Auth()
    async reprocessRaw(@Param("id") id: string) {
        return await this.rawService.reprocessRaw(id);
    }

    @Post("classifyRawsWithAI", {exclude: true })
    @Auth()
    async classifyRawsWithAI() {
        return await this.rawService.classifyRawsWithAI();
    }
}
