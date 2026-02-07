import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from '../../entities/user-action.entity';
import { ErrorLog } from '../../entities/error-log.entity';
import { BehaviorLog } from '../../entities/behavior-log.entity';
import { ApiLog } from '../../entities/api-log.entity';
import { PerformanceLog } from '../../entities/performance-log.entity';
import { ReportDto } from '../../dto/report.dto';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(UserAction)
    private userActionRepository: Repository<UserAction>,
    @InjectRepository(ErrorLog)
    private errorLogRepository: Repository<ErrorLog>,
    @InjectRepository(BehaviorLog)
    private behaviorLogRepository: Repository<BehaviorLog>,
    @InjectRepository(ApiLog)
    private apiLogRepository: Repository<ApiLog>,
    @InjectRepository(PerformanceLog)
    private performanceLogRepository: Repository<PerformanceLog>,
  ) {}

  async getApiLogs(page: number = 1) {
    const [data, total] = await this.apiLogRepository.findAndCount({
      order: { createTime: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
    return {
      total,
      pages: Math.ceil(total / 10),
      data,
    };
  }

  async getActionLogs(page: number = 1) {
    const [data, total] = await this.userActionRepository.findAndCount({
      order: { createTime: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
    return {
      total,
      pages: Math.ceil(total / 10),
      data,
    };
  }

  async getErrorLogs(page: number = 1) {
    const [data, total] = await this.errorLogRepository.findAndCount({
      order: { createTime: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
    return {
      total,
      pages: Math.ceil(total / 10),
      data,
    };
  }

  async getPerformanceLogs(page: number = 1) {
    const [data, total] = await this.performanceLogRepository.findAndCount({
      order: { createTime: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
    return {
      total,
      pages: Math.ceil(total / 10),
      data,
    };
  }

  async getBehaviorLogs(page: number = 1) {
    const [data, total] = await this.behaviorLogRepository.findAndCount({
      order: { createTime: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
    return {
      total,
      pages: Math.ceil(total / 10),
      data,
    };
  }

  async saveReportData(reportDto: ReportDto) {
    const { id, appId, userId, type, data, currentTime, currentPage, ua } =
      reportDto;

    const savePromises = data.map(async (item) => {
      switch (type) {
        case 'action':
          const userAction = this.userActionRepository.create({
            appId,
            userId,
            eventType: item.eventType,
            tagName: item.tagName,
            value: item.value,
            timeStamp: item.timeStamp,
            paths: item.paths,
            x: item.x,
            y: item.y,
            createTime: currentTime,
            currentPage,
            ua,
          });
          return this.userActionRepository.save(userAction);

        case 'error':
          const errorLog = this.errorLogRepository.create({
            logId: id,
            appId,
            userId,
            filename: item.filename,
            functionName: item.functionName,
            errorType: item.errorType,
            tagName: item.tagName,
            errMsg: item.message,
            stack: item.stack,
            colno: item.colno,
            lineno: item.lineno,
            createTime: currentTime,
            currentPage,
            ua,
          });
          return this.errorLogRepository.save(errorLog);

        case 'behavior':
          const behaviorLog = this.behaviorLogRepository.create({
            appId,
            userId,
            subType: item.subType,
            referrer: item.referrer,
            effectiveType: item.effectiveType,
            rtt: item.rtt,
            stayTime: item.stayTime,
            from: item.from,
            to: item.to,
            params: item.params,
            query: item.query,
            name: item.name,
            createTime: currentTime,
            currentPage,
            ua,
          });
          return this.behaviorLogRepository.save(behaviorLog);

        case 'api':
          const apiLog = this.apiLogRepository.create({
            appId,
            userId,
            subType: item.subType,
            method: item.method,
            url: item.url,
            status: item.status,
            startTime: item.startTime,
            endTime: item.endTime,
            duration: item.duration,
            success: item.success,
            createTime: currentTime,
            currentPage,
            ua,
          });
          return this.apiLogRepository.save(apiLog);

        case 'performance':
          const performanceLog = this.performanceLogRepository.create({
            logId: id,
            appId,
            userId,
            name: item.name,
            value: item.value,
            rating: item.rating,
            delta: item.delta,
            createTime: currentTime,
            currentPage,
            ua,
          });
          return this.performanceLogRepository.save(performanceLog);

        default:
          return null;
      }
    });

    await Promise.all(savePromises);
    return { message: '发送成功' };
  }
}
