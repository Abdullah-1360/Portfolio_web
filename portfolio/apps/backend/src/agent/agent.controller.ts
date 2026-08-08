import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { ChatRequestDto, ChatResponseDto } from './agent.dto';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SuggestRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  lastUserMessage: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  lastAssistantReply: string;
}

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chat with Abdullah Shahid (Personal AI Agent)',
    description:
      'Routes prompt to resilient multi-provider LLM graph (Gemini, Groq, Mistral, OpenRouter) and answers authentically as Abdullah based strictly on his resume.',
  })
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return await this.agentService.chat(dto);
  }

  @Post('suggest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate AI follow-up question suggestions',
    description: 'Returns 3 short contextual follow-up questions based on the last conversation exchange.',
  })
  @ApiResponse({ status: 200, description: 'Array of 3 follow-up question strings' })
  async suggest(@Body() dto: SuggestRequestDto): Promise<{ suggestions: string[] }> {
    const suggestions = await this.agentService.suggest(dto.lastUserMessage, dto.lastAssistantReply);
    return { suggestions };
  }
}
