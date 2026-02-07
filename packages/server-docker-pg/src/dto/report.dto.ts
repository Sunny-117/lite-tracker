import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class ReportDto {
  @IsString()
  id: string;

  @IsString()
  appId: string;

  @IsString()
  userId: string;

  @IsString()
  type: string;

  @IsArray()
  data: any[];

  @IsNumber()
  currentTime: number;

  @IsString()
  currentPage: string;

  @IsString()
  ua: string;
}
