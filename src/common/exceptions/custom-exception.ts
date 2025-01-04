import { ErrorCodes } from './error-codes.enum';
import { GraphQLError } from 'graphql';

export type DataException = {
  field: string;
  value: unknown;
};

export class CustomException extends GraphQLError {
  constructor(
    public errorCode: ErrorCodes = ErrorCodes.SERVER_ERROR,
    public devMessage: string = 'Server error',
    public data: DataException | {} = {},
  ) {
    super(devMessage, {
      extensions: {
        code: errorCode,
        data,
      },
    });
  }
}
