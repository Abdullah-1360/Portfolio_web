import { portfolioData } from '@/data/portfolio';
import ScrollBackground from '@/components/ScrollBackground';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import InteractiveTerminal from '@/components/InteractiveTerminal';
import ROICalculator from '@/components/ROICalculator';
import LLMRouterSimulator from '@/components/LLMRouterSimulator';
import SectionWrapper from '@/components/SectionWrapper';
import SectionHeader from '@/components/SectionHeader';

export default function Home() {
  const { personalInfo, skills, projects, experiences, education, currently } = portfolioData;

  return (
    <main className="relative min-h-screen">
      {/* Background & Navigation */}
      <ScrollBackground />
      <ScrollProgressBar />
      <Navbar personalInfo={personalInfo} />

      {/* Hero Section */}
      <HeroSection personalInfo={personalInfo} currently={currently} />

      {/* About & Education */}
      <AboutSection personalInfo={personalInfo} education={education} />

      {/* Interactive CLI Sandbox */}
      <SectionWrapper id="sandbox" className="py-12">
        <SectionHeader
          num="02.5"
          title="Interactive CLI Playground"
          sub="Execute live workflow simulations, inspect MCP server health, and trigger self-healing pipeline demos."
        />
        <InteractiveTerminal />
      </SectionWrapper>

      {/* Technical Skills */}
      <SkillsSection skills={skills} />

      {/* Flagship Projects & Multi-LLM Router Simulator */}
      <ProjectsSection projects={projects} />

      <SectionWrapper id="router-demo" className="py-12">
        <SectionHeader
          num="04.5"
          title="Multi-LLM Outage & Fallback Simulator"
          sub="Live interactive architecture playground demonstrating zero-downtime multi-provider LLM routing."
        />
        <LLMRouterSimulator />
      </SectionWrapper>

      {/* Experience & ROI Calculator */}
      <ExperienceSection experiences={experiences} />

      <SectionWrapper id="roi-calculator" className="py-12">
        <SectionHeader
          num="05.5"
          title="Quantified Automation ROI"
          sub="Test the financial & operational impact of self-healing server infrastructure based on HostBreak benchmarks."
        />
        <ROICalculator />
      </SectionWrapper>

      {/* Contact Section */}
      <ContactSection personalInfo={personalInfo} />
    </main>
  );
}
