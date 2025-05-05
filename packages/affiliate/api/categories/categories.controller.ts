import {
    Controller, Get, Param,
    CacheControl, ContentType,
    Raw
} from "@cmmv/http";

import {
    Cache
} from "@cmmv/cache";

import {
    CategoriesServiceTools
} from "./categories.service";

@Controller("affiliate/categories")
export class CategoriesControllerTools {
    constructor(private readonly categoriesService: CategoriesServiceTools){}

    @Get()
    @Cache("categories:")
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    async getCoupons() {
        return await this.categoriesService.getCategories();
    }
}
