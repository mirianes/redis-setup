import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('start-build')
  async purgeCache(): Promise<string> {
    try {
      if (await this.appService.isBuildAlreadyRunning()) {
        return;
      }

      return await this.appService.startBuild();
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
