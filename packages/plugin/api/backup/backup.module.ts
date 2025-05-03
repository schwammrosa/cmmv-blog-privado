import { Module } from '@cmmv/core';
import { BackupService } from './backup.service';

export const BackupModule = new Module('backup', {
    providers: [BackupService]
});
