import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Student } from 'src/student/student.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Class {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50, unique: true })
  name: string;

  @Field(() => [Student])
  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
