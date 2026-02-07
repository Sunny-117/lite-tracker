import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('performance_logs')
export class PerformanceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logId: string;

  @Column()
  appId: string;

  @Column()
  userId: string;

  @Column({ default: '' })
  name: string;

  @Column({ type: 'float', nullable: true })
  value: number;

  @Column({ default: 'good' })
  rating: string;

  @Column({ type: 'float', nullable: true })
  delta: number;

  @Column({ nullable: true })
  currentPage: string;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column({ type: 'text' })
  ua: string;

  @CreateDateColumn()
  createdAt: Date;
}
