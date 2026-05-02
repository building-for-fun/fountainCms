import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
  IsBoolean,
  IsIn,
  ValidateIf,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldType } from '../schema.types';

const FIELD_TYPES: FieldType[] = [
  'string',
  'text',
  'number',
  'boolean',
  'enum',
  'datetime',
  'relation',
  'media',
];

export class UpdateContentTypeFieldDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsIn(FIELD_TYPES)
  type: FieldType;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  default?: unknown;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ValidateIf((o: UpdateContentTypeFieldDto) => o.type === 'relation')
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message:
      'relationCollection must start with a letter and use lowercase letters, numbers, underscores',
  })
  @MaxLength(255)
  relationCollection?: string;

  @IsOptional()
  @IsBoolean()
  readonly?: boolean;
}

export class UpdateContentTypeDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  label?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateContentTypeFieldDto)
  fields?: UpdateContentTypeFieldDto[];
}
