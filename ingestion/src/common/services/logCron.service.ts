import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '../utils/logger.service';

@Injectable()
export class LogCronService {
  constructor(private readonly loggerService: LoggerService) {}

  @Cron('0 0 * * *') // every day at midnight
  async handleLogMaintenance() {
    await this.loggerService.runMaintenance();
  }
}
