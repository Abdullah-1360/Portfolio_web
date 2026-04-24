import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly config: ConfigService) {}

  async send(dto: ContactDto): Promise<{ success: boolean; message: string }> {
    const apiKey   = this.config.get<string>('MAILEROO_SENDING_KEY');
    const fromEmail = this.config.get<string>('MAILEROO_FROM_EMAIL');
    const fromName  = this.config.get<string>('MAILEROO_FROM_NAME', 'Portfolio Contact Form');
    const toEmail   = this.config.get<string>('CONTACT_TO_EMAIL');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F1E35;color:#F0EDE8;border-radius:8px;">
        <h2 style="color:#E8820C;margin-top:0;">New Portfolio Message</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#9AA3B0;width:80px;">From</td>
            <td style="padding:8px 0;font-weight:600;">${dto.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9AA3B0;">Email</td>
            <td style="padding:8px 0;">
              <a href="mailto:${dto.email}" style="color:#E8820C;">${dto.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9AA3B0;">Subject</td>
            <td style="padding:8px 0;">${dto.subject}</td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid rgba(232,130,12,0.2);margin:16px 0;" />
        <p style="color:#9AA3B0;margin-bottom:8px;">Message:</p>
        <p style="line-height:1.7;white-space:pre-wrap;">${dto.message}</p>
        <hr style="border:none;border-top:1px solid rgba(232,130,12,0.2);margin:16px 0;" />
        <p style="color:#4E5A6A;font-size:12px;margin:0;">
          Sent from your portfolio contact form
        </p>
      </div>
    `;

    const body = {
      from:     { address: fromEmail, display_name: fromName },
      to:       { address: toEmail,   display_name: 'Abdullah Shahid' },
      reply_to: { address: dto.email, display_name: dto.name },
      subject:  `[Portfolio] ${dto.subject} — from ${dto.name}`,
      html,
      plain: `New message from ${dto.name} (${dto.email})\n\nSubject: ${dto.subject}\n\n${dto.message}`,
      tracking: false,
    };

    try {
      const res = await fetch('https://smtp.maileroo.com/api/v2/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { success: boolean; message: string };

      if (!res.ok || !data.success) {
        this.logger.error('Maileroo error', JSON.stringify(data));
        throw new InternalServerErrorException('Failed to send email');
      }

      this.logger.log(`Contact email sent from ${dto.email}`);
      return { success: true, message: `Thanks ${dto.name}, your message has been received! I'll get back to you soon.` };

    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      this.logger.error('Maileroo fetch failed', err);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
