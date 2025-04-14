import { ExceptionFilter, HttpException, ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express'
import { LoggerService } from '../utils/logger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const method = request.method;
        const url = request.url;
        const user = request["user"] || {};
        const userId = user.userId || 'anonymous';
        const reqBody = request.body;
        const date = new Date().toISOString();
        const logHeader = `[${date} | ${method}] ${url} | User: ${userId} | Error: ${exception?.message} | Status : ${status}`;
        this.logger.log(logHeader, reqBody, {});

        response.send({
            statusCode: status,
            date,
            path: request.url,
            message: exception?.message ? exception?.message : exception?.response
        })
    }
}