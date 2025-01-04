import { CreateStudentInput } from './create-student.input';
import { IsInt, IsPositive } from 'class-validator';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStudentInput extends PartialType(CreateStudentInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
