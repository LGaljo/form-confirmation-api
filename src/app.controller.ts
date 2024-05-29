import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async postReceiveFormResponse(@Req() request: Request): Promise<any> {
    const { body } = request;
    return this.appService.receiveFormResponse(body);
  }
}
