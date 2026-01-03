# DAYFLOW - Human Resources Management System

DAYFLOW is a comprehensive Human Resources Management System (HRMS) designed to streamline employee management, attendance tracking, leave management, and payroll processing for organizations.

## Features

- **Employee Management**: Complete employee profile management with personal and job details
- **Attendance Tracking**: Real-time attendance tracking with check-in/check-out functionality
- **Leave Management**: Employee leave requests and admin approval workflow
- **Payroll Management**: Comprehensive salary structure management with detailed breakdowns
- **Reports & Analytics**: Visual reports and analytics for attendance, leave, and payroll data
- **Role-Based Access**: Separate dashboards for employees and administrators
- **User Authentication**: Secure login system with role-based access control

## Technologies Used

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library for building user interfaces
- **shadcn-ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Chart library for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd dayflow
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

To create a production build:

```sh
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```sh
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, DashboardLayout)
│   └── ui/             # UI components (buttons, cards, forms, etc.)
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── admin/         # Admin-specific pages
│   └── employee/      # Employee-specific pages
├── services/           # Business logic and data services
└── lib/                # Utility functions
```

## Usage

### Employee Features

- View personal dashboard with attendance summary
- Check in/out for daily attendance
- Request leave with different leave types
- View salary details and payment history
- Update personal profile information

### Admin Features

- View organization-wide dashboard
- Manage employee records
- Monitor attendance across all employees
- Approve or reject leave requests
- Manage payroll and salary structures
- Generate comprehensive reports and analytics

## Development

The project uses ESLint for code quality. To run linting:

```sh
npm run lint
```

## License

This project is proprietary software. All rights reserved.
