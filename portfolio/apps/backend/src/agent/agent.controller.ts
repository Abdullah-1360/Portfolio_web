import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { ChatRequestDto, ChatResponseDto } from './agent.dto';

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
}
