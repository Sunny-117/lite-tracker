import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('user_actions')
export class UserAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  eventType: string;

  @Column({ nullable: true })
  tagName: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  timeStamp: string;

  @Column({ type: 'text', nullable: true })
  paths: string;

  @Column({ type: 'float', nullable: true })
  x: number;

  @Column({ type: 'float', nullable: true })
  y: number;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column()
  currentPage: string;

  @Column({ type: 'text' })
  ua: string;

  @CreateDateColumn()
  createdAt: Date;
}
