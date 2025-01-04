import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsPositive,
  IsInt,
} from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  classId: number;
}
