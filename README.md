# Asset Management System - Full Stack Project

A modern, enterprise-grade Asset Management System built with React, Redux, TypeScript, and Tailwind CSS. This frontend application integrates with a Spring Boot backend to provide comprehensive asset tracking and management capabilities.

## Features

### 🏢 Employee Management
- Complete CRUD operations for employee records
- Search and filter capabilities
- Active/Inactive status management
- Fields: ID, Full Name, Department, Email, Phone Number, Designation, Status

### 📦 Asset Management
- Comprehensive asset tracking with detailed fields
- Advanced filtering by type, status, and serial number
- Asset properties: ID, Name, Type, Make/Model, Serial Number, Purchase Date, Warranty, Condition, Status, Spare flag, Specifications
- Status tracking: Available, Assigned, Under Repair, Retired
- Condition tracking: New, Good, Needs Repair, Damaged

### 🔄 Assignment Workflow
- Assign available assets to active employees
- Track assignment history with dates and notes
- Return assets to make them available again
- View active assignments and completed history

### 📊 Dashboard
- Real-time statistics widgets
- Assets by Type bar chart visualization
- Color-coded status indicators
- Quick overview of system status

### 🎨 Modern UI/UX
- Dark mode support with theme toggle
- Responsive design for all screen sizes
- Professional Shadcn UI components
- Smooth animations and transitions
- Loading states and error handling

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: Wouter
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Backend Integration**: Express proxy to Spring Boot API

## Getting Started

### Prerequisites

1. Node.js 20 or higher
2. Your Spring Boot backend running (default: `http://localhost:8080`)

### Installation

The project is already set up in Replit. All dependencies are installed automatically.

### Configuration

Set the Spring Boot backend URL (if different from default):

1. Create a `.env` file in the root directory (see `.env.example`)
2. Set `SPRING_BOOT_URL` to your Spring Boot backend URL

```env
SPRING_BOOT_URL=http://localhost:8080
```

### Running the Application

The application runs automatically in Replit. To manually start:

```bash
npm run dev
```

This starts:
- Frontend development server (Vite) on port 5000
- Express proxy server that forwards API requests to Spring Boot

### Connecting to Spring Boot Backend

The Express server acts as a proxy to your Spring Boot backend:

1. Ensure your Spring Boot application is running
2. The proxy forwards all `/api/*` requests to `http://localhost:8080` (or your configured URL)
3. All cookies, authentication headers, and CSRF tokens are properly forwarded
4. The proxy handles CORS automatically

### Spring Boot Backend Requirements

Your Spring Boot backend should have these endpoints (as shown in the provided controllers):

#### Employee Endpoints
- `GET /employees` - Get all employees
- `GET /employees/{id}` - Get employee by ID
- `POST /employees` - Create employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee
- `GET /employees/active` - Get active employees

#### Asset Endpoints
- `GET /assets` - Get all assets
- `GET /assets/paginated` - Get paginated assets
- `GET /assets/{id}` - Get asset by ID
- `POST /assets` - Create asset
- `PUT /assets/{id}` - Update asset
- `DELETE /assets/{id}` - Delete asset
- `GET /assets/statistics` - Get asset statistics
- `GET /assets/statistics/by-type` - Get assets count by type

#### Assignment Endpoints
- `GET /assignments` - Get all assignments
- `POST /assignments/assign` - Assign asset to employee
- `PUT /assignments/return/{id}` - Return asset
- `GET /assignments/asset/{assetId}` - Get asset assignment history
- `GET /assignments/employee/{employeeId}` - Get employee assignment history

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   ├── employees/  # Employee-specific components
│   │   │   ├── assets/     # Asset-specific components
│   │   │   └── assignments/ # Assignment-specific components
│   │   ├── pages/          # Main application pages
│   │   ├── store/          # Redux store and slices
│   │   ├── lib/            # Utilities and helpers
│   │   └── App.tsx         # Main application component
├── server/src/main/java/..
    ├── controller/  # REST endpoints (/api/...)
    ├── service/     # Business logic
    ├── repository/  # Database access
    ├── entity/      # JPA entities
    ├── dto/         # Data transfer objects
└── pom.xml
│   
│ 
├── shared/
│   └── schema.ts           # TypeScript types and Zod schemas
└── design_guidelines.md    # Design system documentation
```

## Development

### State Management

The application uses Redux Toolkit for state management with separate slices:

- `employeeSlice` - Employee data and operations
- `assetSlice` - Asset data, pagination, and filters
- `assignmentSlice` - Assignment operations and history
- `dashboardSlice` - Statistics and analytics

### Type Safety

All types are defined in `shared/schema.ts` and match the Spring Boot entities:

- `Employee` / `InsertEmployee`
- `Asset` / `InsertAsset`
- `AssignmentHistory` / `AssignmentRequest`
- Enums for Status, Condition, etc.

### Adding New Features

1. Define types in `shared/schema.ts`
2. Create Redux slice in `client/src/store/slices/`
3. Build UI components in `client/src/components/`
4. Create page in `client/src/pages/`
5. Add route in `client/src/App.tsx`

## Testing

The application includes:

- TypeScript type checking
- Form validation with Zod schemas
- Error boundaries for graceful error handling
- Loading states for async operations
- Test IDs on all interactive elements (data-testid)

## Troubleshooting

### Backend Connection Issues

If you see "Backend service unavailable" errors:

1. Verify your Spring Boot backend is running
2. Check the backend URL in `.env` or default `http://localhost:8080`
3. Ensure CORS is properly configured in Spring Boot
4. Check the Express proxy logs for connection errors

### Authentication Issues

If authentication fails:

1. Ensure your Spring Boot app uses session cookies
2. Check that Spring Security allows the proxy origin
3. Verify CSRF tokens are properly configured

### UI Issues

1. Clear browser cache and reload
2. Check browser console for JavaScript errors
3. Verify all dependencies are installed: `npm install`

## Contributing

1. Follow TypeScript strict mode guidelines
2. Use existing Shadcn components when possible
3. Follow the design guidelines in `design_guidelines.md`
4. Add proper error handling and loading states
5. Include data-testid attributes for interactive elements

## License

This project is part of an enterprise asset management system.
![Screenshot_2025-11-18_23_25_06](https://github.com/user-attachments/assets/85f4b560-a5b9-4685-bbe8-a234012e7292)
![Screenshot_2025-11-18_23_24_34](https://github.com/user-attachments/assets/b4d103f8-778e-4780-bd0d-1a0e4f5da0cb)
![Screenshot_2025-11-18_23_24_03](https://github.com/user-attachments/assets/8665b590-f68d-46e6-a3d9-c8394a479d4b)


