import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class IdInput {
  @Field(() => Int)
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id: number;
}
