# Savar CF Club Management System

A comprehensive full-stack platform for managing sports clubs, built with modern web technologies. Handle memberships, events, training sessions, merchandise sales, and community engagement—all from one unified dashboard.

**🔗 Live Demo:** [https://club-management-system-jucq.vercel.app/](https://club-management-system-jucq.vercel.app/)  
**📦 Repository:** [github.com/SaucySalamander1/Club-Management-System](https://github.com/SaucySalamander1/Club-Management-System)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## ✨ Features

### Core Functionality

**👥 Member Management**
- User registration and authentication (NextAuth)
- Role-based access control (USER, MEMBER, PLAYER, COACH, ADMIN)
- Member profiles with customizable information
- Membership tier management and status tracking

**📅 Events Management**
- Create and schedule club events (matchdays, jersey launches, meetups, trials, tournaments, etc.)
- Event registration and capacity management
- Public/private event controls
- Event type categorization

**🏋️ Training Sessions**
- Schedule training sessions with capacity limits
- Session registration system
- Status tracking (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- Player attendance management

**💳 Membership & Billing**
- Monthly/recurring membership subscriptions
- Membership status tracking (ACTIVE, EXPIRED, CANCELLED, PENDING)
- Payment history and records
- Auto-renewal options
- Multi-currency support (BDT, etc.)

**🛍️ E-Commerce Shop**
- Product catalog with images and descriptions
- Inventory management
- Size and variant tracking
- Shopping cart and checkout
- Order management system
- Order status tracking (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

**🎭 Media Gallery**
- Image uploads and management
- Category organization (MATCH, TRAINING, EVENT, TROPHY, TEAM)
- Featured image highlighting
- Metadata (date taken, captions)

**🏆 Achievements**
- Track club and team achievements
- Achievement categorization (LEAGUE_TITLE, CUP_WIN, PROMOTION, etc.)
- Featured achievement highlighting
- Historical record keeping

**📊 Admin Dashboard**
- Comprehensive analytics and statistics
- User management
- Order tracking and fulfillment
- Member administration
- Content management

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui, Radix UI
- **Form Handling:** React Hook Form + Zod validation
- **State Management:** Zustand
- **Icons:** Lucide React, Tabler Icons
- **Animation:** Framer Motion
- **Fonts:** Fira Code, Space Grotesk

### Backend
- **Runtime:** Node.js
- **Server Framework:** Next.js API Routes
- **Authentication:** NextAuth.js v5
- **ORM:** Prisma
- **Database:** PostgreSQL

### DevOps & Deployment
- **Hosting:** Vercel
- **Version Control:** Git
- **Environment Management:** dotenv

### Additional Libraries
- `react-hook-form` - Form state management
- `sonner` - Toast notifications
- `clsx` - Utility for className management
- `zod` - TypeScript-first schema validation
- `bcryptjs` - Password hashing

---

## 🏗 Architecture

### Database Architecture

The system uses PostgreSQL with Prisma ORM for data management. Key entities:

```
User (Central entity)
├── Player (extends User with sports-specific data)
├── Membership (recurring subscription)
│   └── MembershipPayment (billing records)
├── EventRegistration (many-to-many with Event)
├── TrainingRegistration (many-to-many with TrainingSession)
└── Order (e-commerce)
    └── OrderItem (order line items)

Independent Models:
├── Event & EventRegistration
├── TrainingSession & TrainingRegistration
├── Product & OrderItem
├── Gallery
└── Achievement
```

### API Architecture

Next.js API routes handle all backend logic:

```
/api/
├── auth/[...nextauth]           # Authentication
├── users/                         # User management
├── members/                       # Member administration
├── events/                        # Event CRUD & registration
├── events/[id]/register/          # Event registration
├── memberships/                   # Subscription management
├── orders/                        # Order management
├── products/                      # Shop products
├── gallery/                       # Media management
├── achievements/                  # Achievement tracking
└── admin/                         # Admin endpoints
    ├── stats/                     # Analytics
    ├── users/[id]/                # User administration
    └── members/[id]/              # Member administration
```

### Frontend Architecture

```
app/
├── (auth)/                        # Authentication pages
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── admin/                         # Protected admin routes
│   ├── page.tsx
│   ├── users/
│   ├── members/
│   ├── events/
│   ├── products/
│   ├── orders/
│   ├── gallery/
│   └── achievements/
├── dashboard/                     # User dashboard
│   ├── page.tsx
│   └── orders/
├── (public)/                      # Public pages
│   ├── page.tsx
│   ├── about/
│   ├── events/
│   ├── gallery/
│   ├── shop/
│   └── membership/
└── api/                           # Backend routes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 12+ (local or remote)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaucySalamander1/Club-Management-System.git
   cd Club-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/club_management
DIRECT_URL=postgresql://user:password@localhost:5432/club_management

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
GOOGLE_ID=your-google-id
GOOGLE_SECRET=your-google-secret

# File Upload (Optional)
NEXT_PUBLIC_UPLOAD_MAX_SIZE=5242880

# External Services (Optional)
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_PUBLISHABLE_KEY=your-publishable-key
```

### Production Deployment

For Vercel deployment, add these variables in **Settings → Environment Variables:**

```env
DATABASE_URL=your-production-database-url
DIRECT_URL=your-production-direct-url
NEXTAUTH_SECRET=strong-random-secret
NEXTAUTH_URL=your-production-url.com
```

---

## 💾 Database Schema

### Core Models

**User**
- User accounts with roles (USER, MEMBER, PLAYER, COACH, ADMIN)
- Authentication credentials
- Profile information

**Player**
- Sports-specific profile data
- Position, jersey number, bio
- Physical attributes (height, weight, age)

**Membership**
- Recurring subscription management
- Status tracking
- Payment history

**Event**
- Club events (matchdays, meetings, trials)
- Registration management
- Capacity control

**TrainingSession**
- Training schedule
- Capacity management
- Attendance tracking

**Product & Order**
- E-commerce catalog
- Order management
- Inventory tracking

**Gallery & Achievement**
- Media management
- Team history tracking

See `prisma/schema.prisma` for complete schema details.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Users
- `GET /api/users` - Get user profile
- `PUT /api/users/[id]` - Update user profile

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (admin)
- `GET /api/events/[id]` - Get event details
- `POST /api/events/[id]/register` - Register for event
- `PUT /api/events/[id]` - Update event (admin)
- `DELETE /api/events/[id]` - Delete event (admin)

### Memberships
- `GET /api/membership` - Get user membership
- `POST /api/membership` - Create membership
- `PUT /api/membership` - Update membership

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (admin)

### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/members` - List all members
- `PUT /api/admin/users/[id]` - Manage user (admin)
- `PUT /api/admin/members/[id]` - Manage member (admin)

### Gallery & Achievements
- `GET /api/gallery` - List gallery images
- `POST /api/gallery` - Upload image (admin)
- `GET /api/achievements` - List achievements
- `POST /api/achievements` - Create achievement (admin)

---

## 📁 Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── (public)/                 # Public routes
│   ├── admin/                    # Protected admin pages
│   ├── api/                      # Backend API routes
│   ├── dashboard/                # User dashboard
│   ├── checkout/                 # Checkout pages
│   └── layout.tsx                # Root layout
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   ├── admin/                    # Admin-specific components
│   ├── forms/                    # Form components
│   └── ...
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma             # Data schema
│   ├── migrations/               # Migration files
│   └── seed.ts                   # Database seeding
├── public/                       # Static assets
├── styles/                       # Global styles
├── types/                        # TypeScript type definitions
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── README.md                     # This file
```

---

## 🛠 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Seed database with sample data
npm run seed
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Deploy migrations to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual database explorer)
npx prisma studio
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prisma for type-safe database access
- Zod for runtime validation

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import the GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Add all `.env` variables in Vercel dashboard
   - Settings → Environment Variables

4. **Deploy**
   ```bash
   git push origin main
   ```
   Vercel will auto-deploy on push.

### Database Setup for Production

1. **PostgreSQL Provider Options:**
   - Supabase (PostgreSQL hosting)
   - Neon (Serverless PostgreSQL)
   - Railway (Simple PostgreSQL)
   - AWS RDS
   - DigitalOcean

2. **Connect to Vercel:**
   - Get `DATABASE_URL` from your provider
   - Add as environment variable in Vercel
   - Run migrations: `npx prisma migrate deploy`

### Build Command for Vercel

The `package.json` already includes the correct build command:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

This ensures Prisma Client is regenerated on each build.

---

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] User authentication & roles
- [x] Member management
- [x] Event system
- [x] Training sessions
- [x] Basic shop
- [x] Gallery & achievements
- [x] Admin dashboard

### Phase 2: Monetization (In Progress)
- [ ] Payment gateway integration (Stripe, bKash)
- [ ] Recurring membership billing
- [ ] Invoicing system
- [ ] Financial reports

### Phase 3: Engagement (Planned)
- [ ] Real-time notifications (push, email, SMS)
- [ ] Community messaging & chat
- [ ] Leaderboards & rankings
- [ ] Social feed

### Phase 4: Analytics (Planned)
- [ ] Advanced performance analytics
- [ ] Player statistics & tracking
- [ ] Revenue & member metrics
- [ ] Attendance reports
- [ ] Predictive analytics

### Phase 5: Scalability (Planned)
- [ ] Multi-club support
- [ ] API for integrations
- [ ] White-label options
- [ ] Mobile app (React Native)
- [ ] Offline-first capabilities

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Test your changes locally
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👤 Author

Built by [SaucySalamander1](https://github.com/SaucySalamander1)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/SaucySalamander1/Club-Management-System/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SaucySalamander1/Club-Management-System/discussions)
- **Live Demo:** [https://club-management-system-jucq.vercel.app/](https://club-management-system-jucq.vercel.app/)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting & infrastructure
- Prisma for ORM excellence
- shadcn/ui for beautiful components
- All contributors and supporters

---

**Made with ❤️ for sports club management**
