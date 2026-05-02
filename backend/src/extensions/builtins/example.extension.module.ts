import { Injectable, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ExtensionHooksRegistry } from '../extension-hooks.registry';

/**
 * Sample extension: loads when EXTENSIONS_ENABLED includes `example`.
 * Fork this pattern — register a Nest module in EXTENSION_CATALOG and ship code in-repo.
 */
@Injectable()
class ExampleExtensionBootstrap implements OnModuleInit {
  private readonly logger = new Logger('ExampleExtension');

  constructor(private readonly hooks: ExtensionHooksRegistry) {}

  onModuleInit(): void {
    this.hooks.register({
      onContentPublished: ({ collection, entryId }) => {
        this.logger.debug(`content published ${collection}/${entryId}`);
      },
    });
  }
}

@Module({
  providers: [ExampleExtensionBootstrap],
})
export class ExampleExtensionModule {}
