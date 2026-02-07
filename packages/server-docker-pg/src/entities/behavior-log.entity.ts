import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('behavior_logs')
export class BehaviorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appId: string;

  @Column()
  userId: string;

  @Column()
  subType: string;

  @Column({ nullable: true })
  referrer: string;

  @Column({ nullable: true })
  effectiveType: string;

  @Column({ nullable: true })
  rtt: number;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  to: string;

  @Column({ type: 'jsonb', nullable: true })
  params: any;

  @Column({ type: 'jsonb', nullable: true })
  query: any;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  stayTime: number;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column({ nullable: true })
  currentPage: string;

  @Column({ type: 'text' })
  ua: string;

  @CreateDateColumn()
  createdAt: Date;
}
