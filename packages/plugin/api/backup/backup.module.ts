import { Module } from '@cmmv/core';

import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';

export const BackupModule = new Module('backup', {
    providers: [BackupService],
    controllers: [BackupController]
});
