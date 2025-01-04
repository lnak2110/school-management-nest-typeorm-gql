import { GraphQLFormattedError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ErrorCodes } from './error-codes.enum';

export function formatError(
  error: GraphQLFormattedError,
): GraphQLFormattedError {
  let customError: GraphQLFormattedError = {
    message: error.message,
    locations: error.locations,
    path: error.path,
    extensions: {
      code: error.extensions?.code,
      data: error.extensions?.data || {},
    },
  };

  if (
    error.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
  ) {
    customError = {
      ...customError,
      message: 'There was a validation error with your request',
      extensions: {
        ...customError.extensions,
        code: ErrorCodes.BAD_REQUEST_INPUT,
      },
    };
  }

  return customError;
}
