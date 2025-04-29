import { Auth } from "@cmmv/auth";

import {
    Controller, Get, Post,
    Queries, Param, Body,
    Response, HttpException,
    HttpStatus, CacheControl,
    Raw, ContentType, Put,
    Delete
} from "@cmmv/http";

import {
    UserBlogService
} from "./user.service";

@Controller('user-blog')
export class UserBlogController {
    constructor(private readonly userService: UserBlogService) {}

    @Get()
    @Auth({ rootOnly: true })
    async getAll(@Queries() queries: any) {
        return this.userService.getAll(queries);
    }

    @Post()
    @Auth({ rootOnly: true })
    async create(@Body() body: any) {
        return this.userService.createUser(body);
    }
}
