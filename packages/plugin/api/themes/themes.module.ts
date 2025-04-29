import { Module } from '@cmmv/core';

import { ThemesContract } from '../../contracts';
import { ThemesPublicService } from './themes.service';
import { ThemesPublicController } from './themes.controller';

export const ThemesModule = new Module('blog_themes', {
    contracts: [ThemesContract],
    controllers: [ThemesPublicController],
    providers: [ThemesPublicService]
});
