import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CustomException } from '../exceptions/custom-exception';
import { ErrorCodes } from '../exceptions/error-codes.enum';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (!value) {
      throw new CustomException(
        ErrorCodes.BAD_REQUEST_INPUT,
        'Empty input',
        {},
      );
    }

    this.checkNullOrUndefinedFields(value);

    const object = plainToClass(metatype, value);
    const errors: ValidationError[] = await validate(object);

    if (errors.length > 0) {
      const error = errors[0];
      const field = error.property;
      const devMessage = Object.values(error.constraints)[0];
      const data = { field, value: value[field] || '' };

      throw new CustomException(ErrorCodes.BAD_REQUEST_INPUT, devMessage, data);
    }

    return object;
  }

  private toValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private checkNullOrUndefinedFields(value: any): void {
    for (const key in value) {
      if (value[key] === null || value[key] === undefined) {
        throw new CustomException(
          ErrorCodes.BAD_REQUEST_INPUT,
          `${key} should not be null or undefined`,
          { field: key, value: value[key] },
        );
      }
    }
  }
}
