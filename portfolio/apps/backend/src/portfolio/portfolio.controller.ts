import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get all portfolio data' })
  getAll() { return this.portfolioService.getAll(); }

  @Get('projects')
  @ApiOperation({ summary: 'Get projects list' })
  getProjects() { return this.portfolioService.getProjects(); }

  @Get('skills')
  @ApiOperation({ summary: 'Get skills list' })
  getSkills() { return this.portfolioService.getSkills(); }

  @Get('experiences')
  @ApiOperation({ summary: 'Get work experiences' })
  getExperiences() { return this.portfolioService.getExperiences(); }

  @Get('education')
  @ApiOperation({ summary: 'Get education' })
  getEducation() { return this.portfolioService.getEducation(); }

  @Get('certificates')
  @ApiOperation({ summary: 'Get certificates' })
  getCertificates() { return this.portfolioService.getCertificates(); }
}
