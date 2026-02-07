import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorModule } from './modules/monitor/monitor.module';
import { UserAction } from './entities/user-action.entity';
import { ErrorLog } from './entities/error-log.entity';
import { BehaviorLog } from './entities/behavior-log.entity';
import { ApiLog } from './entities/api-log.entity';
import { PerformanceLog } from './entities/performance-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [UserAction, ErrorLog, BehaviorLog, ApiLog, PerformanceLog],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MonitorModule,
  ],
})
export class AppModule {}
