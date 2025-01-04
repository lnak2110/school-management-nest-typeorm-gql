import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { CustomException } from './custom-exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, _host: ArgumentsHost) {
    const { errorCode, devMessage, data } = exception;
    throw new CustomException(errorCode, devMessage, data);
  }
}
