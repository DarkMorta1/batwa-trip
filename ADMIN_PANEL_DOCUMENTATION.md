# Comprehensive Admin Panel Documentation

## Overview

This document describes the comprehensive admin panel system built for the Batwa Travels website. The admin panel provides complete control over all frontend content, bookings, users, and website settings without requiring code changes.

## 🏗️ Architecture

### Backend
- **Framework**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT-based admin authentication
- **Structure**: MVC pattern with clean route separation

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Architecture**: Component-based with reusable admin components

## 📦 Database Models

### New Models Created

1. **User** (`server/models/User.js`)
   - User accounts with roles
   - Block/unblock functionality
   - Preferences and avatar support

2. **Booking** (`server/models/Booking.js`)
   - Tour bookings with customer details
   - Status tracking (pending, approved, cancelled, completed)
   - Payment status tracking
   - Voucher/discount support

3. **Inquiry** (`server/models/Inquiry.js`)
   - Customer inquiries/contact forms
   - Status tracking (new, read, replied, archived)
   - Admin notes and reply tracking

4. **WebsiteSettings** (`server/models/WebsiteSettings.js`)
   - Global website configuration
   - Contact information
   - Social media links
   - Maintenance mode
   - Booking system toggle

5. **SEOSettings** (`server/models/SEOSettings.js`)
   - Page-wise SEO configuration
   - Meta titles, descriptions, keywords
   - OpenGraph tags
   - Custom slugs

6. **HomepageContent** (`server/models/HomepageContent.js`)
   - Section-based homepage content management
   - Enable/disable sections
   - Section ordering
   - Custom content per section

7. **ThemeSettings** (`server/models/ThemeSettings.js`)
   - Logo and favicon
   - Color scheme (primary, secondary, accent)
   - Font selection
   - Button styles
   - Theme mode (light/dark/auto)

8. **ActivityLog** (`server/models/ActivityLog.js`)
   - Admin activity tracking
   - Action logging (create, update, delete)
   - IP address and user agent tracking
   - Resource change tracking

### Enhanced Models

1. **Admin** - Added roles (super_admin, admin, editor), email, fullName, isActive, lastLogin tracking

2. **Tour** - Added:
   - Status control (draft, published, hidden)
   - Slug generation
   - Difficulty levels
   - Featured flag
   - Seasonal pricing
   - Day-wise itinerary with detailed structure
   - Includes/excludes lists
   - Video support
   - Map URL
   - Group size limits
   - View and booking counters

3. **Review** - Added:
   - Approval workflow
   - Featured reviews
   - Hide/show without deleting
   - Admin editing capability
   - Photo attachments
   - Verified purchase flag
   - User association

4. **Voucher** - Enhanced with:
   - Discount types (percentage/fixed)
   - Usage limits (total and per-user)
   - Valid date ranges
   - Tour-specific applicability
   - Minimum purchase requirements
   - Maximum discount caps

## 🛣️ API Routes

### Public Routes
- `GET /api/tours` - List published tours
- `GET /api/tours/:id` - Get single tour
- `GET /api/reviews` - List approved reviews
- `POST /api/reviews` - Submit review (requires approval)
- `POST /api/vouchers/validate` - Validate voucher code

### Admin Routes (Protected with JWT)

#### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics and analytics

#### Bookings
- `GET /api/admin/bookings` - List all bookings (with filters)
- `GET /api/admin/bookings/:id` - Get single booking
- `POST /api/admin/bookings` - Create manual booking
- `PUT /api/admin/bookings/:id` - Update booking
- `DELETE /api/admin/bookings/:id` - Delete booking
- `GET /api/admin/bookings/export/csv` - Export bookings as CSV

#### Users
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user with bookings
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `PUT /api/admin/users/:id/role` - Change user role
- `DELETE /api/admin/users/:id` - Delete user

#### Inquiries
- `GET /api/admin/inquiries` - List all inquiries
- `GET /api/admin/inquiries/:id` - Get single inquiry
- `PUT /api/admin/inquiries/:id/status` - Update inquiry status
- `DELETE /api/admin/inquiries/:id` - Delete inquiry

#### Content Management
- `GET /api/admin/homepage-content` - Get all sections
- `GET /api/admin/homepage-content/:section` - Get specific section
- `PUT /api/admin/homepage-content/:section` - Update section
- `PUT /api/admin/homepage-content/reorder` - Reorder sections

#### Settings
- `GET /api/admin/website-settings` - Get website settings
- `PUT /api/admin/website-settings` - Update website settings
- `GET /api/admin/seo` - Get all SEO settings
- `GET /api/admin/seo/:page` - Get page SEO settings
- `PUT /api/admin/seo/:page` - Update page SEO
- `GET /api/admin/theme` - Get theme settings
- `PUT /api/admin/theme` - Update theme settings

#### Activity Logs
- `GET /api/admin/activity-logs` - Get activity logs (with filters)

#### Existing Enhanced Routes
- Tours, Reviews, Vouchers routes now include activity logging

## 🎨 Admin UI Components

### Layout Components
- **AdminLayout** - Main layout with sidebar navigation
- **AdminRoute** - Route wrapper for authentication check

### UI Components
- **Toast** - Notification component
- **Modal** - Reusable modal dialog
- **ConfirmModal** - Confirmation dialog for destructive actions

### Hooks
- **useToast** - Toast notification management hook

### Utilities
- **api.js** - API request utility with auth header handling

## 📄 Admin Pages

### Implemented Pages

1. **Dashboard** (`/admin`)
   - Statistics overview (users, bookings, revenue, tours)
   - Monthly revenue charts
   - Recent bookings list
   - Quick stats cards

2. **Tours Management** (`/admin/tours`)
   - Full CRUD for tours
   - Status control (draft/published/hidden)
   - Featured/trending/upcoming flags
   - Pricing management
   - Image and media management

3. **Bookings Management** (`/admin/bookings`)
   - View all bookings
   - Filter by status
   - Update booking status
   - Export to CSV
   - Manual booking creation

4. **Content Management** (`/admin/content`)
   - Manage homepage sections
   - Enable/disable sections
   - Edit section content (title, description, images)
   - Section ordering (ready for drag & drop)

5. **Website Settings** (`/admin/settings`)
   - Basic site information
   - Contact details
   - Social media links
   - Maintenance mode
   - Booking system toggle

### Placeholder Pages (Routes Ready, UI Coming Soon)

6. **Inquiries Management** (`/admin/inquiries`)
7. **User Management** (`/admin/users`)
8. **Reviews Management** (`/admin/reviews`)
9. **Offers & Coupons** (`/admin/vouchers`)
10. **Media Library** (`/admin/media`)
11. **SEO Settings** (`/admin/seo`)
12. **Branding & Theme** (`/admin/theme`)
13. **Activity Logs** (`/admin/activity`)

## 🔒 Security Features

1. **JWT Authentication**
   - Token-based authentication
   - Token expiration (12 hours)
   - Automatic logout on token expiry

2. **Role-Based Access**
   - Admin roles: super_admin, admin, editor
   - Ready for role-based permissions (infrastructure in place)

3. **Activity Logging**
   - All admin actions are logged
   - Tracks who did what and when
   - IP address and user agent tracking

4. **Input Validation**
   - Server-side validation on all routes
   - Error handling and sanitization

## 🚀 Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables (`.env`):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
```

3. Seed admin user (if needed):
```bash
npm run seed-admin
```

4. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Set environment variables (`.env`):
```
VITE_API_URL=http://localhost:4000
```

3. Start development server:
```bash
npm run dev
```

## 📝 Next Steps / Remaining Work

The following pages need UI implementation (backend APIs are ready):

1. **Inquiries Page** - Backend ready, needs UI
2. **Users Page** - Backend ready, needs UI  
3. **Reviews Page** - Backend ready, needs UI
4. **Vouchers Page** - Backend ready, needs UI
5. **Media Library** - Upload route exists, needs UI
6. **SEO Settings** - Backend ready, needs UI
7. **Theme Settings** - Backend ready, needs UI
8. **Activity Logs** - Backend ready, needs UI

## 🎯 Key Features Implemented

✅ Complete database schema for all features
✅ RESTful API routes with proper error handling
✅ JWT authentication and authorization
✅ Activity logging system
✅ Dashboard with analytics
✅ Tours management with full CRUD
✅ Bookings management with CSV export
✅ Content management for homepage sections
✅ Website settings management
✅ Modern admin UI with Tailwind CSS
✅ Responsive sidebar navigation
✅ Toast notifications
✅ Confirmation modals
✅ Route protection

## 🔄 Admin Panel Philosophy

The admin panel follows the core principle: **"Admin controls everything the user sees without touching code"**

- All frontend content is manageable through the admin panel
- Settings are stored in the database and applied dynamically
- Content changes are instant (no code deployment needed)
- Complete audit trail through activity logs

## 📚 API Documentation

All API endpoints follow RESTful conventions:
- `GET` - Retrieve data
- `POST` - Create new resource
- `PUT` - Update existing resource
- `DELETE` - Delete resource

All admin routes require `Authorization: Bearer <token>` header.

## 🐛 Error Handling

All routes include comprehensive error handling:
- Proper HTTP status codes
- Descriptive error messages
- Logging for debugging
- User-friendly error responses

## 📊 Database Indexes

Indexes are set up for:
- Activity logs (adminId, resource, createdAt)
- Vouchers (code, active status, dates)
- Tours (status, featured, trending)

This ensures optimal query performance as data grows.

---

**Note**: This is a production-ready foundation. The remaining pages follow the same patterns established in the implemented pages and can be built using the same components and utilities.

