import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { ReportDto } from '../../dto/report.dto';

@Controller()
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);

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
  async reportActions(@Body() reportDto: ReportDto) {
    this.logger.log(`Received report: ${JSON.stringify(reportDto)}`);
    
    if (!reportDto || !reportDto.type || !reportDto.data) {
      this.logger.error(`Invalid report data: ${JSON.stringify(reportDto)}`);
      throw new BadRequestException('Missing required fields: type and data are required');
    }
    
    return this.monitorService.saveReportData(reportDto);
  }
}
