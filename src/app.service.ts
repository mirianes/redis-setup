import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Store } from 'cache-manager';

@Injectable()
export class AppService {
  private buildControlCacheKeyName: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Store,
    private readonly configService: ConfigService,
  ) {
    this.buildControlCacheKeyName = this.configService.getOrThrow('CACHE_KEY');
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async startBuild(): Promise<string> {
    await this.cacheManager.del(this.buildControlCacheKeyName);

    const pipelineExecutionId = Math.random().toString();

    await this.setBuildAsRunning(pipelineExecutionId);

    return pipelineExecutionId;
  }

  public async isBuildAlreadyRunning(): Promise<boolean> {
    console.log(this.buildControlCacheKeyName);
    return !!(await this.cacheManager.get(this.buildControlCacheKeyName));
  }

  public async setBuildAsRunning(pipelineExecutionId?: string): Promise<void> {
    await this.cacheManager.set(
      this.buildControlCacheKeyName,
      pipelineExecutionId,
    );
  }
}
