import {
    Controller, Get, RouterSchema,
    Queries, Req, Param,
    CacheControl, ContentType, Raw
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    BackupService
} from "./backup.service";

@Controller("blog")
export class BackupController {
    constructor(private readonly backupService: BackupService){}

    @Get("backup")
    @Auth({ rootOnly: true })
    async getBackups() {
        return this.backupService.getBackups();
    }
}
