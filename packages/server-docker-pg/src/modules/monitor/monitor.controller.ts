import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { ReportDto } from '../../dto/report.dto';

@Controller()
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('/api/test')
  async testApi(@Query('error') error: string) {
    if (error) {
      throw new Error('服务器错误');
    }
    return '发送成功';
  }

  @Get('/api/get/apiLog')
  async getApiLogs(@Query('page') page: string) {
    const pageNum = parseInt(page) || 1;
    return this.monitorService.getApiLogs(pageNum);
  }

  @Get('/api/get/actionLog')
  async getActionLogs(@Query('page') page: string) {
    const pageNum = parseInt(page) || 1;
    return this.monitorService.getActionLogs(pageNum);
  }

  @Get('/api/get/errorLog')
  async getErrorLogs(@Query('page') page: string) {
    const pageNum = parseInt(page) || 1;
    return this.monitorService.getErrorLogs(pageNum);
  }

  @Get('/api/get/performanceLog')
  async getPerformanceLogs(@Query('page') page: string) {
    const pageNum = parseInt(page) || 1;
    return this.monitorService.getPerformanceLogs(pageNum);
  }

  @Get('/api/get/behaviorLog')
  async getBehaviorLogs(@Query('page') page: string) {
    const pageNum = parseInt(page) || 1;
    return this.monitorService.getBehaviorLogs(pageNum);
  }

  @Post('/report/actions')
  @HttpCode(HttpStatus.OK)
  async reportActions(@Body() body: any) {
    const reportDto: ReportDto =
      typeof body === 'string' ? JSON.parse(body) : body;
    return this.monitorService.saveReportData(reportDto);
  }
}
