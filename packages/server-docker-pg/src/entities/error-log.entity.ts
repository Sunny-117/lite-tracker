import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('error_logs')
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logId: string;

  @Column()
  appId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  errorType: string;

  @Column({ type: 'text', default: '' })
  errMsg: string;

  @Column({ type: 'text', default: '' })
  stack: string;

  @Column({ default: '' })
  filename: string;

  @Column({ default: '' })
  functionName: string;

  @Column({ default: '' })
  tagName: string;

  @Column({ nullable: true })
  colno: number;

  @Column({ nullable: true })
  lineno: number;

  @Column({ nullable: true })
  currentPage: string;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column({ type: 'text' })
  ua: string;

  @CreateDateColumn()
  createdAt: Date;
}
