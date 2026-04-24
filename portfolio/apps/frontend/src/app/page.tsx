import { portfolioData } from '@/data/portfolio';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  const { personalInfo, skills, projects, experiences, education, currently } = portfolioData;

  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar personalInfo={personalInfo} />
      <HeroSection personalInfo={personalInfo} currently={currently} />
      <AboutSection personalInfo={personalInfo} education={education} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <ContactSection personalInfo={personalInfo} />
    </main>
  );
}
