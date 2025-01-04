import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class NameInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  keyword: string;
}
