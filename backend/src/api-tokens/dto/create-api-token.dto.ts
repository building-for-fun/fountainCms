import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateApiTokenDto {
  @IsString()
  @MinLength(1)
  name!: string;

  /** Same pattern as role permissions, e.g. ["posts:read"], ["posts:*"], ["*:*"]. */
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissions!: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
