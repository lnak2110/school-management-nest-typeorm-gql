import { CreateClassInput } from './create-class.input';
import { IsInt, IsPositive } from 'class-validator';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClassInput extends PartialType(CreateClassInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
