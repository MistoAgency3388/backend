import { Controller } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  // @Get('ping')
  // getPing() {
  //   return this.appService.getPingMessage();
  // }
}
