import {
    Service, Cron,
    CronExpression
} from "@cmmv/core";

@Service('blog_backup')
export class BackupService {
    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async handleCronBackup() {

    }

    async backupDatabase() {

    }

    async getBackups() {
        return [];
    }
}
