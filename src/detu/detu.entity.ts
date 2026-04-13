import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';

@Entity('detu')
export class DeTu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', default: 2000 })
  sucManh: number;

  @Index()
  @Column()
  userId: number;
}