# RentManager - Complete Home Rent Management System

A comprehensive property rental management system built with Next.js, MongoDB, and Tailwind CSS. Features separate dashboards for property owners and tenants with complete CRUD operations, payment processing, and real-time notifications.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Owner/Tenant)
- Secure password hashing with bcrypt
- Protected routes with middleware

### 🏠 Property Management (Owner)
- Add, edit, and delete properties
- Upload multiple images via Cloudinary
- Rich property descriptions with amenities
- Availability management
- Real-time dashboard analytics

### 🔍 Property Discovery (Tenant)
- Advanced search and filtering
- Location-based search
- Price range filtering
- Room and amenity filters
- Responsive property cards

### 📋 Request Management
- Rental request system
- Approval/rejection workflow
- Real-time status updates
- Email notifications
- Request history tracking

### 💳 Payment Processing
- Stripe integration for secure payments
- Payment history tracking
- Automatic rent reminders
- Payment status management
- Monthly payment tracking

### 📊 Dashboard Analytics
- Property performance metrics
- Revenue tracking
- Request statistics
- Payment analytics
- Visual charts and insights

## 🚀 Tech Stack

### Frontend
- **Next.js 13+** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **Lucide React** for icons

### Backend
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage

### Payment & Communication
- **Stripe** for payment processing
- **Nodemailer** for email notifications
- **Chart.js** for analytics visualization

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Cloudinary account for image uploads
- Stripe account for payments
- Gmail account for email notifications

### 1. Clone and Install
```bash
git clone <repository-url>
cd rent-management-system
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rentmanagement
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentmanagement

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# Email Configuration (Gmail with App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📱 Usage Guide

### For Property Owners

1. **Sign Up** as "Property Owner"
2. **Add Properties** with detailed information and photos
3. **Manage Requests** from potential tenants
4. **Track Payments** and rental income
5. **Monitor Analytics** on your dashboard

### For Tenants

1. **Sign Up** as "Tenant"
2. **Browse Properties** with advanced search filters
3. **Send Rental Requests** to property owners
4. **Make Payments** securely through Stripe
5. **Track Payment History** and request status

## 🏗️ Project Structure

```
rent-management-system/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (.js files)
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── properties/           # Property CRUD operations
│   │   ├── requests/             # Rental request management
│   │   ├── payments/             # Payment processing
│   │   └── upload/               # File upload handling
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Role-based dashboards
│   ├── properties/               # Property browsing and details
│   └── layout.tsx                # Root layout
├── components/                   # Reusable UI components (.tsx)
│   ├── ui/                       # Shadcn/UI components
│   ├── Navbar.tsx                # Navigation component
│   ├── PropertyCard.tsx          # Property display component
│   └── PropertyModal.tsx         # Property creation/editing modal
├── lib/                          # Utility libraries (.js)
│   ├── mongodb.js                # Database connection
│   ├── cloudinary.js             # Image upload utilities
│   └── email.js                  # Email notification utilities
├── models/                       # Mongoose schemas (.js)
│   ├── User.js                   # User model
│   ├── Property.js               # Property model
│   ├── Request.js                # Rental request model
│   └── Payment.js                # Payment model
├── middleware/                   # Authentication middleware (.js)
│   └── withAuth.js               # JWT verification
└── README.md                     # This file
```

## 🔧 Key Features Implementation

### Authentication Flow
- Users register with role selection (owner/tenant)
- JWT tokens stored in HTTP-only cookies
- Role-based route protection
- Automatic token validation

### Property Management
- Rich property details with multiple images
- Cloudinary integration for optimized image storage
- Advanced search and filtering capabilities
- Real-time availability updates

### Payment Processing
- Secure Stripe integration
- Payment intent creation
- Webhook handling for payment confirmation
- Comprehensive payment history

### Email Notifications
- Automated rent reminders
- Request status notifications
- Gmail SMTP integration
- HTML email templates

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookie storage
- Input validation and sanitization
- Protected API routes
- Role-based access control

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
# ... other production environment variables
```

### Build and Deploy
```bash
npm run build
npm start
```

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Form validation on both client and server
- Database operation error handling
- Authentication state management
- Payment processing error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@rentmanager.com or create an issue in the repository.

---

**RentManager** - Simplifying property rental management for the modern world! 🏡✨