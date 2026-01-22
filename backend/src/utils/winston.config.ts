import { transports, format } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonConfig = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike('FountainCMS', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
