import {
    Controller, Get, RouterSchema,
    Queries, Req, Param,
    CacheControl, ContentType, Raw
} from "@cmmv/http";

import {
    CDNService
} from "./cdn.service";

@Controller("blog")
export class CDNController {
    constructor(private readonly cdnService: CDNService){}

}
