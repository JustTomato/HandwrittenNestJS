import { Controller, Get, Req, Request, Query, Headers, Session } from "@nestjs/common";
import { Request as ExpressRequest } from 'express'
@Controller('users')
export class UserController {
  @Get('req')
  handleRequest(@Req() req: ExpressRequest, age: number, @Request() request: ExpressRequest) {
    console.log('url', req.url);
    console.log('age', age)
    console.log('method', request.method);
    return 'handleRequest'
  }
  @Get('query')
  handleQuery(@Query() query: any, @Query('id') id: string) {
    console.log('query', query);
    console.log('id', id);
    return `query id:${id}`
  }
  @Get('headers')
  handleHeaders(@Headers() headers: any, @Headers('accept') accept: string) {
    console.log('headers', headers);
    console.log('accept', accept);
    return `accept:${accept}`
  }
  @Get('session')
  handleSession(@Session() session: any, @Session('pageView') pageView: string) {
    console.log('session', session);
    console.log('pageView', pageView);
    if (session.pageView) {
      session.pageView++;
    } else {
      session.pageView = 1;
    }
    return `pageView:${session.pageView}`
  }
}