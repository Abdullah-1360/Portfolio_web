export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  bio: string;
  bio2: string;
}

export type SkillLevel = 'Proficient' | 'Familiar' | 'Learning';

export interface Skill {
  name: string;
  level: SkillLevel;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  cgpa: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface Currently {
  label: string;
  value: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education;
  certificates: Certificate[];
  currently: Currently[];
}
