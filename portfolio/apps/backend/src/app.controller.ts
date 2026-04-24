import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      status: 'ok',
      message: 'Abdullah Shahid — Portfolio API',
      endpoints: {
        portfolio: '/api/portfolio',
        projects:  '/api/portfolio/projects',
        skills:    '/api/portfolio/skills',
        experience:'/api/portfolio/experiences',
        contact:   '/api/contact',
        docs:      '/docs',
      },
    };
  }
}
