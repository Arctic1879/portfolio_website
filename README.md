# Portfolio Website Documentation

## Project Overview
A modern, responsive portfolio website built with Next.js 13+, React, TypeScript, and Tailwind CSS. The website features a clean, professional design with dark mode support and includes sections for showcasing skills, projects, education, and professional updates.

## Tech Stack
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Email Service**: EmailJS
- **Icons**: Lucide React
- **Authentication**: Custom implementation with environment variables

## Project Structure

```
portfolio_website/
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin dashboard for content management
│   ├── api/               # API routes for data manipulation
│   │   ├── data/         # Data management endpoints
│   │   │   ├── courses/  # Course data endpoints
│   │   │   ├── projects/ # Project data endpoints
│   │   │   ├── skills/   # Skills data endpoints
│   │   │   └── updates/  # Updates data endpoints
│   ├── contact/          # Contact page with EmailJS integration
│   ├── education/        # Education and courses showcase
│   ├── projects/         # Projects portfolio
│   ├── skills/          # Skills showcase
│   ├── updates/         # Professional updates
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Homepage
├── components/           # Reusable React components
│   ├── ui/              # shadcn/ui components
│   ├── add-course-form.tsx
│   ├── add-project-form.tsx
│   ├── add-skill-form.tsx
│   ├── footer.tsx
│   ├── navbar.tsx
│   ├── skill-card.tsx
│   └── theme-provider.tsx
├── lib/                 # Utility functions and data
│   ├── data.ts         # Central data store
│   └── utils.ts        # Helper functions
├── public/             # Static assets
├── styles/            # Global styles
└── .env              # Environment variables
```

## Key Features

### Authentication System
- Two-layer security system for admin access:
  1. Secret code (typed anywhere): Triggers password prompt
  2. Password authentication: Grants admin access
- Environment variables for secure credential storage
- Automatic logout functionality

### Content Management
- Admin dashboard for managing:
  - Skills (with multiple categories)
  - Projects
  - Education/Courses
  - Professional Updates
- Real-time content updates
- Form validation and error handling

### Dynamic Data Handling
- Server-side data management
- File-based data storage
- Optimized data formatting
- Type-safe data structures

### Contact System
- EmailJS integration for contact form
- Real-time form validation
- Success/error notifications
- Spam prevention

### UI/UX Features
- Responsive design
- Dark mode support
- Modern animations
- Toast notifications
- Loading states
- Error handling
- Accessibility features

## Environment Variables
```env
# Admin Authentication
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_ADMIN_CODE=your_secret_code

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## Component Documentation

### Navigation
- `navbar.tsx`: Main navigation component with dynamic admin access
- `footer.tsx`: Footer with copyright and social links

### Forms
- `add-skill-form.tsx`: Form for adding/editing skills with multi-category support
- `add-project-form.tsx`: Project management form with image upload
- `add-course-form.tsx`: Education/course management form
- `contact/page.tsx`: Contact form with EmailJS integration

### Cards and Display
- `skill-card.tsx`: Display component for individual skills
- Various UI components from shadcn/ui library

## API Routes

### Skills API
- Endpoint: `/api/data/skills`
- Methods: POST
- Functionality: Add/remove skills, update categories

### Projects API
- Endpoint: `/api/data/projects`
- Methods: POST
- Functionality: Manage project entries with image handling

### Courses API
- Endpoint: `/api/data/courses`
- Methods: POST
- Functionality: Manage education and course entries

### Updates API
- Endpoint: `/api/data/updates`
- Methods: POST
- Functionality: Manage professional updates

## Development Guidelines

### Adding New Features
1. Create components in `/components`
2. Add API routes in `/app/api` if needed
3. Update types in relevant files
4. Add environment variables if required
5. Update documentation

### Best Practices
- Use TypeScript for type safety
- Follow component-based architecture
- Implement error handling
- Add loading states
- Include accessibility features
- Write clean, documented code

### Security Considerations
- Store sensitive data in environment variables
- Implement proper validation
- Use secure authentication methods
- Handle errors gracefully
- Protect admin routes

## Deployment
The project is built to be deployed on Vercel or similar platforms:
1. Set up environment variables
2. Configure build settings
3. Deploy main branch
4. Monitor build logs
5. Test all features post-deployment

## Maintenance
Regular maintenance tasks include:
1. Updating dependencies
2. Checking for security vulnerabilities
3. Monitoring error logs
4. Backing up data
5. Updating content
6. Testing admin functionality 