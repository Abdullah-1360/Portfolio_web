import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Project Inquiry' })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Hi Abdullah, I would like to discuss a project...' })
  @IsNotEmpty()
  @MinLength(10)
  message: string;
}
