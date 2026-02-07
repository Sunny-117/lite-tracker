import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('api_logs')
export class ApiLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appId: string;

  @Column()
  userId: string;

  @Column()
  subType: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'bigint', nullable: true })
  startTime: number;

  @Column({ type: 'bigint', nullable: true })
  endTime: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  success: string;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column()
  currentPage: string;

  @Column({ type: 'text' })
  ua: string;

  @CreateDateColumn()
  createdAt: Date;
}
