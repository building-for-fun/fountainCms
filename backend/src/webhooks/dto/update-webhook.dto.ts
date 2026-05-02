import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWebhookDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @IsUrl({ require_tld: false })
  url?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  events?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collections?: string[];

  @IsOptional()
  @IsObject()
  headers?: Record<string, string> | null;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  /** When true, replaces `secret`; returned once from PATCH response. */
  @IsOptional()
  @IsBoolean()
  regenerateSecret?: boolean;
}
