import {
    Service, Cron,
    CronExpression
} from "@cmmv/core";

import {
    Repository, LessThanOrEqual
} from "@cmmv/repository";

@Service('logs')
export class LogsService {
    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.deleteOldLogs.call(this);
    }

    /**
     * Deletes all logs older than 7 days
     */
    async deleteOldLogs() {
        const LogsEntity = Repository.getEntity("LogsEntity");

        const result = await Repository.findAll(LogsEntity, {
            timestamp: LessThanOrEqual(Date.now() - 1000 * 60 * 60 * 24 * 1),
            limit: 10000
        }, [], {
            select: ["id"]
        });

        if(result){
            console.log("Deleting " + result.count + " logs");

            for (const log of result.data) {
                await Repository.delete(LogsEntity, log.id);
                //console.log("Deleted log " + log.id);
            }
        }
    }
}
