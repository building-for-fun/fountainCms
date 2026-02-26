import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email or username',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password: string;
}
