import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { UserAction } from '../../entities/user-action.entity';
import { ErrorLog } from '../../entities/error-log.entity';
import { BehaviorLog } from '../../entities/behavior-log.entity';
import { ApiLog } from '../../entities/api-log.entity';
import { PerformanceLog } from '../../entities/performance-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAction,
      ErrorLog,
      BehaviorLog,
      ApiLog,
      PerformanceLog,
    ]),
  ],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
