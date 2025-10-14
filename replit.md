# Asset Management System

## Overview
Enterprise-grade Asset Management System built with React, Redux, TypeScript, and Spring Boot backend. This application provides comprehensive tools for managing employees, assets, and asset assignments with a professional, modern UI.

## Recent Changes (October 14, 2025)
- Initial implementation of complete frontend application
- Redux Toolkit state management setup with slices for employees, assets, assignments, and dashboard
- All CRUD operations for employees and assets
- Assignment workflow with history tracking
- Dashboard with real-time statistics and charts
- Advanced filtering and search capabilities
- Dark mode support with theme toggle
- Responsive design with Shadcn UI components

## Project Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: Wouter
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Date Handling**: date-fns

### Backend Integration
The frontend integrates with a Spring Boot REST API backend:
- **Base URL**: Proxied through Express server at `/api/*`
- **Endpoints**:
  - `/api/employees` - Employee CRUD operations
  - `/api/assets` - Asset CRUD operations with pagination
  - `/api/assignments` - Assignment operations and history
  - `/api/assets/statistics` - Dashboard statistics

### Key Features

#### 1. Employee Management
- Complete CRUD operations (Create, Read, Update, Delete)
- Fields: ID, Full Name, Department, Email, Phone, Designation, Status
- Search and filter capabilities
- Active/Inactive status management
- Data validation with Zod schemas

#### 2. Asset Management
- Comprehensive asset tracking with all required fields
- Asset properties: ID, Name, Type, Make/Model, Serial Number, Purchase Date, Warranty, Condition, Status, Spare flag, Specifications
- Advanced filtering by type, status, and serial number
- Status tracking: Available, Assigned, Under Repair, Retired
- Condition tracking: New, Good, Needs Repair, Damaged
- Spare asset designation

#### 3. Assignment Workflow
- Assign available assets to active employees
- Track assignment history with dates and notes
- Return assets to make them available again
- View active assignments and completed history
- Assignment notes for additional context

#### 4. Dashboard
- Real-time statistics widgets:
  - Total Assets
  - Available Assets
  - Assigned Assets
  - Under Repair Assets
  - Retired Assets
  - Spare Assets
- Assets by Type bar chart visualization
- Color-coded status indicators

### Design System
- **Color Palette**: Professional blue and gray theme with semantic colors
- **Typography**: Inter for UI, JetBrains Mono for technical data
- **Components**: Consistent use of Shadcn components
- **Spacing**: 4px base unit with consistent padding/margins
- **Dark Mode**: Full dark mode support with automatic theme persistence
- **Interactions**: Hover elevation effects with smooth transitions

### State Management
Redux slices organized by domain:
- `employeeSlice`: Employee data and operations
- `assetSlice`: Asset data, pagination, and filters
- `assignmentSlice`: Assignment operations and history
- `dashboardSlice`: Statistics and analytics data

### User Preferences
- Theme preference (light/dark) persisted to localStorage
- Sidebar collapse state
- Filter preferences maintained during session

## API Integration Notes
The Express backend acts as a proxy to the Spring Boot API. All requests to `/api/*` are forwarded to the Spring Boot backend running on a different port. CORS is handled at the proxy level.

## Development Workflow
1. Frontend development server runs on port 5000 (Vite)
2. Backend Express proxy forwards API calls to Spring Boot
3. Hot module replacement for instant updates during development
4. TypeScript provides type safety across the application

## Testing Approach
- Component testing with data-testid attributes for all interactive elements
- Form validation with Zod schemas matching backend expectations
- Error handling with toast notifications
- Loading states for async operations
