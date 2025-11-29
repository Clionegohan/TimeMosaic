import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/__ping')
  ping() {
    return 'ok';
  }
}

