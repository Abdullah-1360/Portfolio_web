import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatHistoryItemDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsString()
  role: 'user' | 'assistant';

  @ApiProperty()
  @IsString()
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({ description: 'User message or query to Abdullah Shahid', example: 'What systems have you built at HostBreak?' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Recent conversation history (up to last 6 turns)', type: [ChatHistoryItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryItemDto)
  history?: ChatHistoryItemDto[];
}

export class ChatResponseDto {
  @ApiProperty({ description: 'First-person authentic response from Abdullah Shahid' })
  response: string;

  @ApiProperty({ description: 'Provider that routed this response' })
  provider: string;

  @ApiProperty({ description: 'Model that generated this response' })
  model: string;

  @ApiProperty({ description: 'Tier category of the routed model' })
  tier: string;

  @ApiProperty({ description: 'Latency in milliseconds' })
  latencyMs: number;
}
