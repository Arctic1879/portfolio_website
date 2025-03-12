export type Education = {
  degree: string
  institution: string
  location: string
  date: string
  description: string
  gpa?: string
}

export type Certificate = {
  name: string
  issuer: string
  date: string
  url?: string
}

export type OnlineCourse = {
  name: string
  platform: string
  instructor?: string
  startDate: string
  endDate?: string
  description: string
  url?: string
  completed: boolean
}

export type Skill = {
  name: string
  proficiency: "expert" | "advanced" | "intermediate" | "beginner"
  categories: ("language" | "framework" | "tool" | "soft" | "database" | "other")[]
}

export type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
}

export type Update = {
  id: string
  title: string
  date: string
  content: string
  type: "course" | "certificate" | "project" | "other"
} 