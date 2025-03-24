import { Controller,Get } from "@nestjs/common";
@Controller()
export class AppController{
  @Get()
  index(){
    return 'hello'
  }
  @Get('info')
  main(){
    return 'info'
  }
}