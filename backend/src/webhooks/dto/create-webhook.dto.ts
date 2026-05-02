import {
  ArrayMinSize,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWebhookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MaxLength(2048)
  @IsUrl({ require_tld: false })
  url!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  events!: string[];

  /** If empty or omitted, all collections receive events. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collections?: string[];

  /** Optional extra headers (string values only); merged into the outbound POST. */
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
