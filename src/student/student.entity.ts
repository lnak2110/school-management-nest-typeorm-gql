import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Class } from 'src/class/class.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Student {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50, unique: true })
  name: string;

  @Field(() => Int)
  @Column('int', { name: 'class_id' })
  classId: number;

  @Field(() => Class)
  @ManyToOne(() => Class, (class_) => class_.students, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
