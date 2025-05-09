import {
    Controller, Get, Post,
    Queries, Body, User,
    Put, Param
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    WhitelabelService
} from "./whitelabel.service";

@Controller("whitelabel")
export class WhitelabelController {
    constructor(private readonly whitelabelService: WhitelabelService){}

    @Get()
    @Auth()
    async getWhitelabel(@Queries() queries: any) {
        return await this.whitelabelService.getWhitelabel(queries);
    }

    @Get("admin")
    async getWhitelabelAdmin() {
        return await this.whitelabelService.getWhitelabelAdmin();
    }

    @Get("access")
    @Auth()
    async getWhitelabelAccessByUser(@User() user: any) {
        return await this.whitelabelService.getWhitelabelAccessByUser(user);
    }

    @Post()
    @Auth({ rootOnly: true })
    async insetWhitelabel(@Body() whitelabel: any) {
        return await this.whitelabelService.insetWhitelabel(whitelabel);
    }

    @Put("/:id")
    @Auth({ rootOnly: true })
    async updateWhitelabel(@Body() whitelabel: any, @Param("id") id: string) {
        return await this.whitelabelService.updateWhitelabel(id, whitelabel);
    }
}