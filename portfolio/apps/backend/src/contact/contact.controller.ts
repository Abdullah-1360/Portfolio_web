import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiCreatedResponse({ description: 'Message received' })
  async send(@Body() dto: ContactDto) {
    return this.contactService.send(dto);
  }
}
