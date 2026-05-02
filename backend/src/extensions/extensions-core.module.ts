import { Global, Module, type DynamicModule } from '@nestjs/common';
import { ExtensionHooksRegistry } from './extension-hooks.registry';
import { ExtensionsController } from './extensions.controller';
import { ENABLED_EXTENSION_IDS } from './extensions.constants';

@Global()
@Module({})
export class ExtensionsCoreModule {
  static forRoot(enabledExtensionIds: string[]): DynamicModule {
    return {
      global: true,
      module: ExtensionsCoreModule,
      controllers: [ExtensionsController],
      providers: [
        ExtensionHooksRegistry,
        { provide: ENABLED_EXTENSION_IDS, useValue: enabledExtensionIds },
      ],
      exports: [ExtensionHooksRegistry],
    };
  }
}
