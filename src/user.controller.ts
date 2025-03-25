import { Controller, Get, Req, Request, Query, Headers, Session, Ip, Param } from "@nestjs/common";
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
  handleSession(@Session() session: any): string {
    if (session.views) {
      session.views++;
    } else {
      session.views = 1;
    }
    return `Number of views: ${session.views}`;
  }
  @Get('ip')
  getUserIp(@Ip() ip: string) {
    console.log('ip', ip)
    return `ip:${ip}`
  }
  @Get(':username/info/:age')
  getUserNameInfo(@Param() params, @Param('username') username: string, @Param('age') age: number) {
    console.log('params', params)
    console.log('username', username)
    console.log('age', age)
    return `age:${age}`
  }
  @Get('star/ab*de')
  handleWildCard() {
    return 'handleWildCard'
  }
}