import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class ClassNameInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  className: string;
}
