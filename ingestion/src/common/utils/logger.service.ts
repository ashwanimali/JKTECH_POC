import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LoggerService {
    private logDirectory: string;
    private logRetentionDays: number;

    constructor(private readonly configService: ConfigService) {
        const logPath = this.configService.get('LOG_DIRECTORY_PATH') || 'src/logs';
        const retention = this.configService.get('LOG_RETENTION_DAYS');
        this.logDirectory = path.resolve(process.cwd(), logPath);
        this.logRetentionDays = retention ? parseInt(retention) : 7;

        this.ensureDirectoryExists(this.logDirectory);
    }

    private getTodayFolderPath(): string {
        const currentDate = new Date().toISOString().split('T')[0];
        return path.join(this.logDirectory, currentDate);
    }

    private ensureDirectoryExists(dirPath: string) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    log(message: string, requestBody?: any, responseBody?: any, duration?: number) {
        const todayFolder = this.getTodayFolderPath();
        const logFile = path.join(todayFolder, 'log.txt');

        this.ensureDirectoryExists(todayFolder);

        const timestamp = new Date().toISOString();

        let logEntry = `${timestamp} - ${message}`;

        if (duration !== undefined) {
            logEntry += ` - ${duration}ms`;
        }

        if (requestBody) {
            logEntry += `\n  Request: ${JSON.stringify(requestBody, null, 2)}`;
        }

        if (responseBody) {
            logEntry += `\n  Response: ${JSON.stringify(responseBody, null, 2)}`;
        }

        logEntry += '\n';

        fs.appendFileSync(logFile, logEntry);
        console.log(`[LOGGER] ${logEntry.trim()}`);
    }


    archiveOldLogs() {
        const archiveDate = new Date();
        archiveDate.setDate(archiveDate.getDate() - 2); // 2-day old folder for archiving
        const folderName = archiveDate.toISOString().split('T')[0];
        const folderPath = path.join(this.logDirectory, folderName);
        const archiveFile = `${folderPath}.tgz`;

        if (fs.existsSync(folderPath)) {
            exec(`tar -czf "${archiveFile}" -C "${this.logDirectory}" "${folderName}"`, (err) => {
                if (err) {
                    console.error('[LOGGER] Archive error:', err);
                    return;
                }
                console.log(`[LOGGER] Archived folder: ${folderName}`);
                fs.rmSync(folderPath, { recursive: true, force: true });
            });
        }
    }

    deleteOldArchives() {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - this.logRetentionDays);

        fs.readdirSync(this.logDirectory).forEach(file => {
            if (file.endsWith('.tgz')) {
                const filePath = path.join(this.logDirectory, file);
                const stats = fs.statSync(filePath);
                if (stats.mtime < cutoff) {
                    fs.unlinkSync(filePath);
                    console.log(`[LOGGER] Deleted old archive: ${file}`);
                }
            }
        });
    }

    async runMaintenance() {
        this.archiveOldLogs();
        this.deleteOldArchives();
    }
}
