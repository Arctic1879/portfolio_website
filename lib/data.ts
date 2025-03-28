// Types
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
  endDate?: string  // Optional for ongoing courses
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

// Data
export const educationData: Education[] = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "Butler University",
    location: "Indianapolis, IN",
    date: "2020 - 2024",
    description:
      "Specialized in software engineering, algorithms, and artificial intelligence, with a focus on practical applications. Conducted research on integrating AI into computer science education while serving as a teaching assistant for Python programming courses.",
    gpa: "3.4/4.0",
  },
]

export const certificateData: Certificate[] = [
  {
    name: "SQL Associate",
    issuer: "DataCamp",
    date: "February 2025",
    url: "https://www.datacamp.com/certificate/SQA0018903352748",
  },
  {
    name: "Data Engineer Associate",
    issuer: "DataCamp",
    date: "February 2025",
    url: "https://www.datacamp.com/certificate/DEA0018185552855",
  }
]

export const onlineCoursesData: OnlineCourse[] = [
  {
    name: "Associate Data Engineer in SQL",
    platform: "DataCamp",
    instructor: "Timo Grossenbacher, Lis Sulmont, and others",
    startDate: "February 2025",
    endDate: "February 2025",
    description: "Comprehensive course covering data engineering fundamentals, data modeling, data visualization,and cloud integration using SQL.",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/5a8b02fe358c6efb7b8ce328986f1061f1b21fee",
    completed: true
  },
  {
    name: "SQL Fundamentals",
    platform: "DataCamp",
    instructor: "Mona Khalil, Fernando Gonzalez Prada, and others",
    startDate: "February 2025",
    endDate: "February 2025",
    description: "Comprehensive course covering SQL fundamentals, database design, and data manipulation.",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/6d1db0cfe3e71b9fe8e33c6f5a9e7e9e8c4256cd",
    completed: true
  },
  {
    name: "CompTIA  A+ Core 1",
    platform: "Udemy",
    instructor: "Mike Meyers",
    startDate: "February 2025",
    endDate: "March 2025",
    description: "Comprehensive training covering PC hardware, mobile devices, networking technology, troubleshooting, and operating systems.",
    url: "https://www.udemy.com/certificate/UC-013e74f4-bffa-4127-9c1e-d9d793ffd489/",
    completed: true
  }
]

export const skillsData: Skill[] = [
  {
    name: "JavaScript",
    proficiency: "advanced",
    categories: ["language"]
  },
  {
    name: "TypeScript",
    proficiency: "advanced",
    categories: ["language"]
  },
  {
    name: "Python",
    proficiency: "expert",
    categories: ["language"]
  },
  {
    name: "Java",
    proficiency: "intermediate",
    categories: ["language"]
  },
  {
    name: "C++",
    proficiency: "intermediate",
    categories: ["language"]
  },
  {
    name: "SQL",
    proficiency: "expert",
    categories: ["language", "database"]
  },
  {
    name: "React",
    proficiency: "advanced",
    categories: ["framework"]
  },
  {
    name: "Next.js",
    proficiency: "advanced",
    categories: ["framework"]
  },
  {
    name: "Node.js",
    proficiency: "advanced",
    categories: ["framework"]
  },
  {
    name: "TailwindCSS",
    proficiency: "advanced",
    categories: ["framework"]
  },
  {
    name: "Git",
    proficiency: "expert",
    categories: ["tool"]
  },
  {
    name: "Problem Solving",
    proficiency: "expert",
    categories: ["soft"]
  },
  {
    name: "Team Collaboration",
    proficiency: "advanced",
    categories: ["soft"]
  },
  {
    name: "Communication",
    proficiency: "expert",
    categories: ["soft"]
  },
  {
    name: "PostGreSQL",
    proficiency: "expert",
    categories: ["database", "tool"]
  },
  {
    name: "CSS",
    proficiency: "intermediate",
    categories: ["language"]
  },
  {
    name: "C#",
    proficiency: "advanced",
    categories: ["language"]
  },
  {
    name: "R",
    proficiency: "advanced",
    categories: ["language"]
  },
  {
    name: ".NET",
    proficiency: "advanced",
    categories: ["framework"]
  },
  {
    name: "Angular",
    proficiency: "advanced",
    categories: ["framework"]
  },
  {
    name: "MySQL",
    proficiency: "advanced",
    categories: ["database", "tool"]
  },
  {
    name: "SQLite",
    proficiency: "advanced",
    categories: ["database", "tool"]
  },
  {
    name: "MongoDB",
    proficiency: "intermediate",
    categories: ["database", "tool"]
  },
  {
    name: "Windows/MacOS",
    proficiency: "expert",
    categories: ["tool"]
  },
  {
    name: "OpenMP",
    proficiency: "intermediate",
    categories: ["framework"]
  },
  {
    name: "MPI",
    proficiency: "intermediate",
    categories: ["framework"]
  },
  {
    name: "Github",
    proficiency: "expert",
    categories: ["tool"]
  },
  {
    name: "TCP/IP",
    proficiency: "advanced",
    categories: ["tool"]
  },
  {
    name: "Leadership",
    proficiency: "advanced",
    categories: ["soft"]
  },
  {
    name: "HTML",
    proficiency: "advanced",
    categories: ["language"]
  }
]

export const projectsData: Project[] = [
  {
    id: "project-3",
    title: "Personal Portfolio Website",
    description: "A modern, responsive portfolio website built with Next.js 13+, featuring dark mode, admin dashboard, and dynamic content management. Implements a two-layer security system and includes EmailJS integration for contact functionality.",
    tags: ["Next.js", "TypeScript", "React", "Tailwind CSS", "EmailJS"],
    image: "site.png",
    githubUrl: "https://github.com/Arctic1879/portfolio_website",
    featured: true
  },
  {
    id: "project-1",
    title: "IT Ticketing System",
    description: "A full-stack IT ticketing system built in C# and ASP.NET Core. Features include user authentication, ticket creation, and management.",
    tags: ["C#", "ASP.NET Core", "SQL", "Python","Entity Framework"],
    image: "/IT-Diagram-Icon.png?",
    featured: true
  },
  {
    id: "project-2",
    title: "IHSAA Scoring Website Prototype",
    description: "A prototype for a scoring website for the IHSAA (Indiana High School Athletic Association). Built with Angular, SQL Server, and Azure services for backend API integration and data storage. Demo unavailable as it contains sensitive information.",
    tags: ["Angular", "TypeScript", "SQL Server", "Azure"],
    image: "/IHSAA-logo.png",
    featured: true
  }
]

export const updatesData: Update[] = [
  {
    id: "update-1741735203579",
    title: "Launched - Personal Portfolio Website",
    date: "March 12, 2025",
    content: "Developed and launched my portfolio website using Next.js 13+, featuring dark mode, content management system, and EmailJS integration for contact functionality.",
    type: "project"
  },
  {
    id: "update-1741735203578",
    title: "Completed - \" TOTAL: CompTIA A+ Core 1 (220-1101)\" Course",
    date: "March 8, 2025",
    content: "Now reviewing target content to prepare for the first A+ exam",
    type: "course"
  },
  {
    id: "update-1741735484623",
    title: "Completed - DataCamp: \"SQL Associate\" Certificate",
    date: "February 21, 2025",
    content: "Bolstered my understanding of SQL and its use in data manipulation",
    type: "certificate"
  },
  {
    id: "update-1741735362989",
    title: "Completed - DataCamp: \"Data Engineer Associate\" Certificate",
    date: "February 9, 2025",
    content: "Strengthened my foundations in SQL data management and gained an understanding of core principles and activities performed by data engineers",
    type: "certificate"
  },
  {
    id: "update-1741735098914",
    title: "Started - \"TOTAL: CompTIA A+ Core 1 (220-1101)\" Course",
    date: "January 24, 2025",
    content: "I'm starting to prepare for the CompTIA A+ exam",
    type: "course"
  },
  {
    id: "update-1741736801806",
    title: "Finished - Bachelor's Degree \"Computer Science\"",
    date: "December 22, 2024",
    content: "Butler University, Graduated with a 3.4 GPA and a minor in Biology",
    type: "other"
  },
  {
    id: "update-1741736267934",
    title: "Completed - IHSAA Website Scoring Prototype",
    date: "May 2, 2024",
    content: "Happy to learn the Angular framework and work with APIs, NDA prevents future content disclosure due to student PID contained in prototype.",
    type: "project"
  },
  {
    id: "update-1741735692345",
    title: "Finished - IT Help Desk Application",
    date: "April 28, 2024",
    content: "My first truly full-stack application using C#, ASP.Net, SQL, and Python",
    type: "project"
  }
]

