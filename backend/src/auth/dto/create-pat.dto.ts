import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO to request creation of a Personal Access Token.
 */
export class CreatePatDto {
  @ApiProperty({ example: 'deploy-token', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
