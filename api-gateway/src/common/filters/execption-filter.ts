/* eslint-disable max-classes-per-file */
import { ExceptionFilter, HttpException, ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor() { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        response.send({
            statusCode: status,
            path: request.url,
            message: exception?.message ? exception?.message : exception?.response
        })
    }
}