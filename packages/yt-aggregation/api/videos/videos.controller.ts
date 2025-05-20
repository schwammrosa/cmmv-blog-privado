import {
    Controller, Get,
    Queries, Param,
    Post, Body, Put, Delete
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    YTVideosServiceAdmin
} from "./videos.service";

@Controller("ytfeed/videos/admin")
export class YTVideosController {
    constructor(private readonly ytVideosService: YTVideosServiceAdmin){}

    /**
     * Get all videos with optional filters
     * @param queries Query parameters for filtering videos
     * @returns Videos list
     */
    @Get("/")
    @Auth("ytvideos:get")
    async getVideos(@Queries() queries: any) {
        return this.ytVideosService.getVideos(queries);
    }

    /**
     * Generate AI content for a video
     * @param id Video ID
     * @param data Optional content override
     * @returns AI generated content
     */
    @Post("/ai/:id")
    @Auth("ytvideos:get")
    async getAIVideo(@Param("id") id: string, @Body() data?: any) {
        return this.ytVideosService.getAIVideo(id, data);
    }

    /**
     * Update a video
     * @param id Video ID
     * @param data Update data
     * @returns Update result
     */
    @Put("/:id")
    @Auth("ytvideos:update")
    async updateVideo(@Param("id") id: string, @Body() data: any) {
        return this.ytVideosService.updateVideo(id, data);
    }

    /**
     * Reject a video
     * @param id Video ID
     * @param reason Rejection reason
     * @returns Rejection result
     */
    @Delete("/reject/:id")
    @Auth("ytvideos:update")
    async rejectVideo(@Param("id") id: string, @Body() data: any) {
        return this.ytVideosService.rejectVideo(id, data);
    }
}
