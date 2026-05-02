import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Matches,
  MaxLength,
  IsBoolean,
  IsIn,
  ValidateIf,
  IsNotEmpty,
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

export class CreateContentTypeFieldDto {
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

  /** Required when type is `relation` — slug of the referenced collection. */
  @ValidateIf((o: CreateContentTypeFieldDto) => o.type === 'relation')
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

export class CreateContentTypeDto {
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message:
      'name must start with a letter and contain only lowercase letters, numbers, underscores',
  })
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  label?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContentTypeFieldDto)
  fields: CreateContentTypeFieldDto[];
}
