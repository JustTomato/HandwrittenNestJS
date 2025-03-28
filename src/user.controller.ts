import {
  Controller,
  Get, Post,
  Req, Request, Query, Headers, Session, Ip, Param, Body, Response
} from "@nestjs/common";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
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
  @Post('create')
  createUser(@Body() createUserDto, @Body('username') username: string) {
    console.log('createUserDto', createUserDto)
    console.log('username', username)
    return 'user created'
  }
  @Get('response')
  response(@Response() response: ExpressResponse) {
    console.log('response', response)
    response.send('send');
    // response.json({ success: true })
    return 'response'
  }
  @Get('passthrough')
  passthrough(@Response({ passthrough: true }) response: ExpressResponse) {
    response.setHeader('key', 'value')
    return 'response'
  }
}
/**
 * 在使用Nest.js的时候，一般来说一个实体会定义两个类型，一个是dto(data transform object)，一个是interface
 * dto 客户端向服务器提交数据对象，比如说当用户注册的时候（用户名跟密码）然后服务器一般会获取此dto，然后保存在数据库中
 * 保存的时候可能还会加入其他一些默认值例如时间戳、对密码加密
 * 同时也还会过滤掉某些字段，比如注册的时候密码跟确认密码，但是保存到数据库时只需要密码
 * 
 * 数据库保存的数据类型一般会定义为一个interface
 * 
 * 例如
 * 
 * userDto { 用户名 密码 确认密码 }
 * 
 * userInterface { 用户名、密码、创建时间、 更新时间 }
 * 
 */