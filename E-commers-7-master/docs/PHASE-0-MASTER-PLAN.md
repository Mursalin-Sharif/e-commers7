# Paki.com — Phase 0 Master Plan

> Reference: https://www.demo.gotourbd.com/ (design/UX inspiration only — no proprietary assets copied)
> Brand: **Paki** | Domain: **Paki.com** | Market: **Bangladesh** | Currency: **BDT (৳)**

---

## 1. Reference Website Audit

### 1.1 Platform Type
Bangladesh-focused multi-category e-commerce storefront with Bangla-first UX, guest-friendly checkout, and a separate admin panel.

### 1.2 Public URL Patterns Discovered

| Route Pattern | Example | Status |
|---|---|---|
| `/` | Homepage | ✅ Accessible |
| `/shop` | All products listing | ✅ Accessible |
| `/category/{slug}` | `/category/gadget` | ✅ Accessible |
| `/subcategory/{slug}` | `/subcategory/smart-watch` | ✅ Accessible |
| `/products/{slug}` | `/products/t-shirt` | ✅ Accessible (filter/tag listing) |
| `/search?q={query}` | `/search?q=watch` | ✅ Accessible |
| `/customer/login` | Customer login | ✅ Accessible |
| `/customer/register` | Customer registration | ✅ Accessible |
| `/customer/checkout` | Cart + checkout | ✅ Accessible |
| `/customer/order-track` | Order tracking | ✅ Accessible |
| `/contact-us` | Contact page | ✅ Accessible |
| `/page/{slug}` | CMS pages | ✅ Accessible |
| `/admin/panel` | Admin login | 🔒 Login required (not bypassed) |

### 1.3 Reference Layout & UX Patterns

**Header**
- Logo (left)
- Center search bar ("Search Product...")
- Right utilities: Track Order, Login/Sign Up, Cart badge
- Horizontal category nav with mega-menu (3-level hierarchy)
- Sticky behavior on scroll (inferred)

**Homepage Sections**
- Hero banner carousel
- Category icon/grid shortcuts
- Multiple product rows grouped by category (Gadget, Grocery, Beauty & Health, Home Decor)
- Each row: section title + "view more" + horizontal/ grid product cards
- Product cards: image, discount badge (%), product name, original price (strikethrough), sale price

**Product Card Actions**
- `অর্ডার করুন` (Order Now) — direct to checkout
- `কার্টে যোগ করুন` (Add to Cart)

**Shop / Listing Page**
- Breadcrumb (Home)
- Sort dropdown: Latest, Oldest, Price H-L, Price L-H, Name A-Z, Name Z-A
- Product grid
- Pagination + per-page selector (10–1000)

**Checkout**
- Guest checkout form (name, phone, address, etc.)
- Delivery charge display: Dhaka inside ৳70, outside ৳130
- Order confirmation notice in Bangla
- COD-focused messaging

**Auth**
- Login: mobile number + password
- Register: name + mobile + password
- Forgot password link

**Footer**
- Address, phone
- Useful links: User Area, Order Tracking, Shop, Contact, Admin Area
- Policy links: Delivery Rules, Return Policy, Terms, Privacy
- Social icons + payment method badges
- Copyright

**Mobile UX**
- Bottom fixed nav: Category | WhatsApp | Home | Cart | Login
- Floating WhatsApp button

### 1.4 Reference Design Language (for Paki inspiration)

| Element | Reference Pattern | Paki Adaptation |
|---|---|---|
| Typography | Clean sans-serif, Bangla + English mix | Inter + Noto Sans Bengali |
| Colors | Orange/red accent, white cards, light gray bg | User-defined primary/secondary (pending) |
| Cards | Rounded corners, shadow on hover, discount badge top-left | Premium card with subtle elevation |
| Spacing | Compact grid, dense product listing | Slightly more breathing room for premium feel |
| CTAs | Bold colored buttons, Bangla labels | Bilingual CTAs with icon support |
| Currency | ৳ prefix, no decimals mostly | Same (BDT) |

### 1.5 Reference Gaps (Paki will exceed)

Reference site does NOT publicly expose:
- Dedicated product detail page (quick-buy flow dominant)
- Wishlist
- Seller marketplace
- Owner/Admin dashboards (login-only)
- Landing page builder
- Theme management
- Advanced RBAC
- Coupon system (not visible on storefront)
- Reviews on product cards
- Brand pages

**Paki.com will implement all requested features while keeping reference-inspired storefront UX.**

---

## 2. Complete Sitemap

### 2.1 Customer Storefront

```
/                                    → Homepage (builder-driven)
/shop                                → All products
/search                              → Search results
/category/{slug}                     → Category listing
/category/{slug}/{subslug}           → Subcategory listing
/brand                               → All brands
/brand/{slug}                        → Brand products
/product/{slug}                      → Product detail (Paki adds this)
/cart                                → Shopping cart
/checkout                            → Checkout
/checkout/success                    → Order confirmation
/checkout/failed                     → Payment failed
/track-order                         → Guest order tracking
/login                               → Customer login
/register                            → Customer registration
/forgot-password                     → Password reset request
/reset-password/{token}              → Password reset
/account                             → Customer dashboard
/account/orders                      → My orders
/account/orders/{id}                 → Order detail + tracking
/account/wishlist                    → Wishlist
/account/profile                     → Profile settings
/account/addresses                   → Address book
/account/notifications               → Customer notifications
/contact                             → Contact us
/faq                                 → FAQ
/about                               → About Paki
/page/{slug}                         → CMS / Landing pages (unlimited)
/sitemap.xml                         → SEO sitemap
/robots.txt                          → Robots
```

### 2.2 Seller Portal

```
/seller/login
/seller/register
/seller/dashboard
/seller/products
/seller/products/create
/seller/products/{id}/edit
/seller/orders
/seller/inventory
/seller/analytics
/seller/profile
/seller/payouts
```

### 2.3 Admin Dashboard

```
/admin/login
/admin/dashboard
/admin/products
/admin/categories
/admin/brands
/admin/orders
/admin/customers
/admin/sellers
/admin/coupons
/admin/reviews
/admin/inventory
/admin/banners
/admin/menus
/admin/homepage
/admin/landing-pages
/admin/landing-pages/{id}/builder
/admin/settings/*
/admin/notifications
/admin/activity-log
```

### 2.4 Owner Dashboard (extends Admin)

```
/owner/dashboard                     → Super analytics
/owner/admins                        → Admin CRUD + permissions
/owner/system                        → System settings
/owner/audit-logs                    → Full audit trail
/owner/theme                         → Global theme control
/owner/integrations                  → Payment, email, storage
```

### 2.5 API Routes (REST)

```
/api/v1/auth/*
/api/v1/products/*
/api/v1/categories/*
/api/v1/brands/*
/api/v1/cart/*
/api/v1/wishlist/*
/api/v1/orders/*
/api/v1/payments/*
/api/v1/reviews/*
/api/v1/coupons/*
/api/v1/search/*
/api/v1/settings/*
/api/v1/landing-pages/*
/api/v1/admin/*
/api/v1/owner/*
/api/v1/seller/*
/api/v1/notifications/*
/api/v1/analytics/*
/api/v1/uploads/*
```

---

## 3. Page Discovery Checklist

| Page | Reference | Paki Target |
|---|---|---|
| Homepage | ✅ | ✅ + Builder |
| Shop / All Products | ✅ | ✅ |
| Category | ✅ | ✅ |
| Subcategory | ✅ | ✅ |
| Product Detail | ⚠️ Limited | ✅ Full page |
| Brand Listing | ❌ | ✅ |
| Brand Detail | ❌ | ✅ |
| Search | ✅ | ✅ Advanced filters |
| Cart | ✅ (checkout) | ✅ Dedicated cart |
| Checkout | ✅ | ✅ + coupons + payment |
| Login | ✅ | ✅ |
| Register | ✅ | ✅ |
| Forgot Password | ✅ Link | ✅ |
| Order Tracking | ✅ | ✅ Timeline |
| Contact | ✅ | ✅ |
| FAQ | ❌ | ✅ |
| About | ❌ | ✅ |
| Delivery Rules | ✅ CMS | ✅ |
| Return Policy | ✅ CMS | ✅ |
| Terms & Conditions | ✅ CMS | ✅ |
| Privacy Policy | ✅ CMS | ✅ |
| Landing Pages | ❌ | ✅ Unlimited |
| Customer Account | 🔒 | ✅ |
| Wishlist | ❌ | ✅ |
| Seller Portal | ❌ | ✅ |
| Admin Dashboard | 🔒 | ✅ |
| Owner Dashboard | ❌ | ✅ |

---

## 4. Complete Feature Checklist

### Storefront
- [ ] Responsive header with mega menu
- [ ] Search with autocomplete
- [ ] Product grid with filters & sort
- [ ] Product detail with gallery, variants, reviews
- [ ] Cart (persistent per user/session)
- [ ] Wishlist
- [ ] Checkout (guest + logged-in)
- [ ] COD + Online payment (SSLCommerz-ready)
- [ ] Coupon application
- [ ] Order tracking timeline
- [ ] Customer account area
- [ ] Notifications
- [ ] SEO (meta, OG, schema, sitemap)

### Management
- [ ] Product CRUD + bulk + variants
- [ ] Category hierarchy
- [ ] Brand management
- [ ] Order management + status workflow
- [ ] Inventory + low stock alerts
- [ ] Coupon management
- [ ] Review moderation
- [ ] Banner management
- [ ] Menu management
- [ ] Footer management
- [ ] Homepage builder
- [ ] Unlimited landing page builder
- [ ] Theme/color/logo management
- [ ] Website settings
- [ ] Analytics dashboards
- [ ] Notification system
- [ ] Audit logs

### Security & Platform
- [ ] RBAC (Owner, Admin, Moderator, Seller, Customer)
- [ ] JWT/session auth with refresh
- [ ] Password hashing (bcrypt/argon2)
- [ ] Rate limiting
- [ ] Input validation (Zod)
- [ ] File upload security
- [ ] Environment-based config
- [ ] Production deployment ready

---

## 5. Owner / Admin Permission Matrix

### 5.1 Role Hierarchy

```
OWNER (super admin, immutable top role)
  └── ADMIN (permission-controlled by Owner)
        └── MODERATOR (content/order moderation)
              └── SELLER (own products/orders)
                    └── CUSTOMER (shopping)
```

### 5.2 Permission Groups

| Permission Group | Owner | Admin* | Moderator | Seller | Customer |
|---|:---:|:---:|:---:|:---:|:---:|
| **System** |
| Manage admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| System settings | ✅ | ⚙️ | ❌ | ❌ | ❌ |
| Audit logs (full) | ✅ | ⚙️ | ❌ | ❌ | ❌ |
| Theme/branding | ✅ | ⚙️ | ❌ | ❌ | ❌ |
| **Catalog** |
| Products (all) | ✅ | ⚙️ | ⚙️ | Own | View |
| Categories | ✅ | ⚙️ | ⚙️ | View | View |
| Brands | ✅ | ⚙️ | ⚙️ | View | View |
| Inventory (all) | ✅ | ⚙️ | ⚙️ | Own | ❌ |
| **Commerce** |
| Orders (all) | ✅ | ⚙️ | ⚙️ | Own | Own |
| Payments | ✅ | ⚙️ | ❌ | View own | Own |
| Coupons | ✅ | ⚙️ | ❌ | ❌ | Apply |
| Refunds/returns | ✅ | ⚙️ | ⚙️ | Own | Request |
| **Content** |
| Homepage builder | ✅ | ⚙️ | ❌ | ❌ | ❌ |
| Landing pages | ✅ | ⚙️ | ⚙️ | ❌ | View |
| Banners/menus/footer | ✅ | ⚙️ | ⚙️ | ❌ | ❌ |
| Reviews moderation | ✅ | ⚙️ | ✅ | View own | Create |
| **Users** |
| Customers | ✅ | ⚙️ | View | ❌ | Self |
| Sellers | ✅ | ⚙️ | View | Self | ❌ |
| Admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Analytics** |
| Full analytics | ✅ | ⚙️ | Limited | Own | ❌ |
| Notifications | ✅ | ⚙️ | ⚙️ | Own | Own |

> ⚙️ = Owner can enable/disable per Admin via granular permission flags

### 5.3 Admin Granular Permissions (Owner assigns)

```typescript
type AdminPermissions = {
  products: { view: boolean; create: boolean; edit: boolean; delete: boolean; bulk: boolean };
  categories: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  brands: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  orders: { view: boolean; edit: boolean; cancel: boolean; refund: boolean };
  customers: { view: boolean; edit: boolean; suspend: boolean };
  inventory: { view: boolean; adjust: boolean };
  coupons: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  reviews: { view: boolean; approve: boolean; reject: boolean; delete: boolean };
  content: { homepage: boolean; landingPages: boolean; banners: boolean; menus: boolean };
  settings: { website: boolean; theme: boolean; payment: boolean; shipping: boolean; email: boolean };
  analytics: { view: boolean; export: boolean };
};
```

---

## 6. Database Architecture

### 6.1 ER Overview

```
users ──┬── user_roles ── roles ── role_permissions ── permissions
        ├── addresses
        ├── carts ── cart_items ── products
        ├── wishlists ── wishlist_items ── products
        ├── orders ── order_items ── products
        │           ├── order_status_history
        │           └── payments
        ├── reviews ── review_images
        └── notifications

products ──┬── product_images
           ├── product_variants
           ├── product_tags
           ├── categories (M2M via product_categories)
           ├── brands
           └── inventory_logs

categories (self-referential parent_id)
brands
coupons ── coupon_usages

landing_pages ── landing_page_sections
homepage_sections
banners
menus ── menu_items
settings (key-value JSON)
audit_logs
```

### 6.2 Core Tables (PostgreSQL)

#### users
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(255) | |
| email | VARCHAR(255) UNIQUE NULL | |
| phone | VARCHAR(20) UNIQUE | BD format |
| password_hash | VARCHAR(255) | |
| avatar | VARCHAR(500) NULL | |
| role | ENUM | owner/admin/moderator/seller/customer |
| status | ENUM | active/suspended/banned |
| email_verified_at | TIMESTAMP NULL | |
| phone_verified_at | TIMESTAMP NULL | |
| last_login_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### admin_permissions
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users | Admin only |
| permissions | JSONB | Granular flags |
| created_by | UUID FK → users | Owner |
| updated_at | TIMESTAMP | |

#### products
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| seller_id | UUID FK NULL | Marketplace |
| name | VARCHAR(500) | |
| slug | VARCHAR(500) UNIQUE | |
| sku | VARCHAR(100) UNIQUE | |
| category_id | UUID FK | Primary category |
| brand_id | UUID FK NULL | |
| price | DECIMAL(12,2) | |
| sale_price | DECIMAL(12,2) NULL | |
| stock | INTEGER | |
| min_order_qty | INTEGER DEFAULT 1 | |
| short_description | TEXT | |
| description | TEXT | |
| specifications | JSONB | |
| weight | DECIMAL(8,2) NULL | |
| shipping_info | JSONB | |
| is_featured | BOOLEAN | |
| is_published | BOOLEAN | |
| seo_title | VARCHAR(255) | |
| seo_description | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### product_variants
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| product_id | UUID FK | |
| name | VARCHAR(255) | e.g. "Red / XL" |
| sku | VARCHAR(100) | |
| price | DECIMAL(12,2) NULL | Override |
| sale_price | DECIMAL(12,2) NULL | |
| stock | INTEGER | |
| attributes | JSONB | {color, size} |
| image | VARCHAR(500) NULL | |

#### categories
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| parent_id | UUID FK NULL | Self-ref |
| name | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| image | VARCHAR(500) NULL | |
| banner | VARCHAR(500) NULL | |
| description | TEXT | |
| sort_order | INTEGER | |
| is_active | BOOLEAN | |
| seo_title | VARCHAR(255) | |
| seo_description | TEXT | |

#### orders
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| order_number | VARCHAR(50) UNIQUE | PAKI-20260902-0001 |
| user_id | UUID FK NULL | Guest allowed |
| status | ENUM | placed/confirmed/processing/shipped/out_for_delivery/delivered/cancelled/returned |
| payment_status | ENUM | pending/paid/failed/refunded |
| payment_method | ENUM | cod/online |
| subtotal | DECIMAL(12,2) | |
| discount | DECIMAL(12,2) | |
| shipping_fee | DECIMAL(12,2) | |
| tax | DECIMAL(12,2) | |
| total | DECIMAL(12,2) | |
| coupon_id | UUID FK NULL | |
| shipping_address | JSONB | |
| customer_name | VARCHAR(255) | |
| customer_phone | VARCHAR(20) | |
| customer_email | VARCHAR(255) NULL | |
| notes | TEXT NULL | |
| created_at | TIMESTAMP | |

#### order_status_history
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| order_id | UUID FK | |
| status | ENUM | |
| note | TEXT NULL | |
| created_by | UUID FK NULL | |
| created_at | TIMESTAMP | |

#### landing_pages
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| status | ENUM | draft/published/scheduled |
| featured_image | VARCHAR(500) NULL | |
| seo_title | VARCHAR(255) | |
| seo_description | TEXT | |
| published_at | TIMESTAMP NULL | |
| scheduled_at | TIMESTAMP NULL | |
| created_by | UUID FK | |
| created_at | TIMESTAMP | |

#### landing_page_sections
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| landing_page_id | UUID FK | |
| type | VARCHAR(50) | hero/banner/text/... |
| content | JSONB | Section-specific data |
| sort_order | INTEGER | |
| is_visible | BOOLEAN | |

#### settings
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| group | VARCHAR(100) | general/theme/payment/shipping |
| key | VARCHAR(255) | |
| value | JSONB | |
| UNIQUE(group, key) | | |

### 6.3 Indexes (Key)
- `products(slug)`, `products(sku)`, `products(category_id)`, `products(brand_id)`, `products(is_published, is_featured)`
- `orders(order_number)`, `orders(user_id)`, `orders(status)`, `orders(created_at)`
- `categories(slug)`, `categories(parent_id)`
- `landing_pages(slug, status)`
- Full-text: `products(name, description)` via GIN/tsvector

---

## 7. Project Architecture

### 7.1 Tech Stack (Recommended)

| Layer | Technology | Rationale |
|---|---|---|
| Frontend (Storefront) | **Next.js 15** (App Router) | SSR/SSG for SEO, React ecosystem |
| Frontend (Admin/Owner) | **Next.js 15** (separate app or `/admin` route group) | Shared types, unified deploy option |
| Backend API | **Next.js API Routes** + **tRPC** or **REST** | Full-stack TypeScript |
| Database | **PostgreSQL 16** | Relational, JSONB, full-text search |
| ORM | **Prisma** | Type-safe migrations |
| Auth | **NextAuth.js v5** + custom RBAC | Session + JWT |
| Cache | **Redis** | Sessions, rate limit, cache |
| File Storage | **S3-compatible** (AWS S3 / Cloudflare R2 / local dev) | Product images |
| Search | **PostgreSQL FTS** → Meilisearch (phase 2) | Start simple, scale later |
| Email | **Resend** / SMTP | Transactional emails |
| Payments | **SSLCommerz** adapter | Bangladesh standard |
| UI | **Tailwind CSS** + **shadcn/ui** | Premium, consistent |
| Forms | **React Hook Form** + **Zod** | Validation |
| State | **TanStack Query** | Server state |
| Drag & Drop | **@dnd-kit** | Page builder reorder |
| Charts | **Recharts** | Admin analytics |
| Deployment | **Docker** + **VPS** / **Vercel** + **Railway** | Flexible |

### 7.2 Monorepo Structure

```
paki.com/
├── apps/
│   ├── web/                    # Customer storefront (Next.js)
│   └── admin/                  # Admin + Owner dashboard (Next.js)
├── packages/
│   ├── database/               # Prisma schema + migrations + seed
│   ├── api/                    # Shared API logic / tRPC routers
│   ├── auth/                   # RBAC, permissions, middleware
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Helpers (currency, slug, etc.)
│   └── config/                 # ESLint, TSConfig shared
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.admin
│   └── docker-compose.yml
├── docs/
│   ├── PHASE-0-MASTER-PLAN.md
│   ├── DEPLOYMENT.md
│   └── API.md
├── .env.example
├── package.json                # Turborepo root
├── turbo.json
└── README.md
```

### 7.3 Request Flow

```
Browser → Next.js (SSR/CSR)
       → API Route / tRPC
       → Auth Middleware (RBAC check)
       → Service Layer (business logic)
       → Prisma → PostgreSQL
       → Redis (cache/session)
       → S3 (uploads)
```

### 7.4 Auth Flow

```
Customer: phone/email + password → JWT cookie → protected /account/*
Admin:    email + password → JWT cookie → /admin/* (permission middleware)
Owner:    same as admin but role=owner → bypass permission checks
Seller:   email + password → /seller/*
```

---

## 8. Design System — Paki.com

### 8.1 Brand Identity (Pending User Input)

| Token | Value | Status |
|---|---|---|
| Primary Color | TBD | ⏳ User to provide |
| Secondary Color | TBD | ⏳ User to provide |
| Logo | TBD | ⏳ User to provide |
| Favicon | TBD | ⏳ User to provide |
| Phone | TBD | ⏳ User to provide |
| Email | TBD | ⏳ User to provide |
| Address | TBD | ⏳ User to provide |

### 8.2 Default Theme Tokens (until user provides)

```css
:root {
  /* Placeholder — overridden by dashboard theme settings */
  --color-primary: #E85D04;      /* Warm marketplace orange */
  --color-primary-dark: #D00000;
  --color-secondary: #1A1A2E;    /* Deep navy */
  --color-accent: #FAA307;
  --color-success: #2D6A4F;
  --color-warning: #E9C46A;
  --color-error: #E63946;
  --color-bg: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-text: #1A1A2E;
  --color-text-muted: #6C757D;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
}
```

### 8.3 Typography

| Use | Font | Weight |
|---|---|---|
| Headings | **Plus Jakarta Sans** | 600–800 |
| Body (EN) | **Inter** | 400–600 |
| Body (BN) | **Noto Sans Bengali** | 400–600 |
| Mono (SKU, codes) | **JetBrains Mono** | 400 |

### 8.4 Component Library

**Storefront Components**
- `Header` — logo, search, nav, cart, auth
- `MegaMenu` — 3-level category dropdown
- `ProductCard` — image, badge, title, price, actions
- `ProductGrid` — responsive 2/3/4/5 col
- `FilterSidebar` — price, brand, category, rating
- `CartDrawer` — slide-over cart
- `CheckoutForm` — multi-step
- `OrderTimeline` — status tracker
- `HeroBanner` — carousel
- `CategoryScroller` — horizontal icons
- `Footer` — multi-column
- `MobileBottomNav` — 5-icon bar
- `WhatsAppFab` — floating button

**Admin Components**
- `AdminSidebar` — collapsible nav
- `AdminTopbar` — search, notifications, profile
- `StatCard` — KPI display
- `DataTable` — sortable, filterable, paginated
- `FormBuilder` — dynamic forms
- `ImageUploader` — drag-drop with preview
- `RichTextEditor` — product descriptions
- `PageBuilder` — section editor
- `PermissionMatrix` — checkbox grid
- `AnalyticsChart` — line/bar/pie

### 8.5 Responsive Breakpoints

| Name | Width | Columns |
|---|---|---|
| xs | < 480px | 2 (products) |
| sm | 480–767px | 2 |
| md | 768–1023px | 3 |
| lg | 1024–1279px | 4 |
| xl | 1280px+ | 5 |

### 8.6 Animation Guidelines
- Page transitions: 200ms ease-out fade
- Card hover: translateY(-2px) + shadow increase
- Cart add: fly-to-cart micro-animation
- Skeleton loaders for all async content
- Dropdown: 150ms slide-down
- Respect `prefers-reduced-motion`

---

## 9. Landing Page Builder Architecture

### 9.1 Concept

Database-driven section renderer. Each landing page = ordered list of typed sections with JSON content. Owner/Admin edits via visual builder; frontend renders dynamically.

### 9.2 Section Types

| Type | Key Fields | Renderer |
|---|---|---|
| `hero` | title, subtitle, CTA, bg image/video, overlay | Full-width banner |
| `banner` | image, link, alt | Image strip |
| `text` | heading, body (rich text), alignment | Prose block |
| `image` | src, alt, caption, width | Single image |
| `video` | url (YouTube/embed), autoplay | Video embed |
| `product_grid` | query: category/brand/tags/limit | Product grid |
| `product_slider` | query + autoplay | Carousel |
| `category_grid` | category IDs or all | Category cards |
| `brand_grid` | brand IDs or all | Brand logos |
| `featured_products` | limit | Auto-query featured |
| `best_sellers` | limit, period | Auto-query |
| `new_arrivals` | limit | Auto-query |
| `discount_products` | min_discount%, limit | Auto-query |
| `countdown` | end_date, title, CTA | Timer banner |
| `testimonials` | items[]{name, text, avatar, rating} | Slider |
| `reviews` | product_id or auto | Review cards |
| `faq` | items[]{question, answer} | Accordion |
| `newsletter` | title, subtitle | Email form |
| `cta` | title, subtitle, button, link | CTA block |
| `custom_html` | html (sanitized) | DOMPurify render |
| `spacer` | height(px) | Empty space |
| `divider` | style, color | HR element |

### 9.3 Section JSON Schema Example

```json
{
  "type": "hero",
  "content": {
    "title": "Welcome to Paki",
    "subtitle": "Bangladesh's Premium Marketplace",
    "ctaText": "Shop Now",
    "ctaLink": "/shop",
    "backgroundImage": "/uploads/hero-bg.jpg",
    "overlayOpacity": 0.4,
    "textAlign": "center"
  },
  "settings": {
    "paddingTop": 80,
    "paddingBottom": 80,
    "fullWidth": true
  }
}
```

### 9.4 Builder UI Architecture

```
┌─────────────────────────────────────────────────────┐
│  [← Back]  Page: Summer Sale  [Preview] [Publish]   │
├──────────┬──────────────────────┬───────────────────┤
│ Sections │     Canvas (live)    │  Properties Panel │
│ ──────── │                      │                   │
│ ≡ Hero   │  [Rendered section]  │  Title: [____]    │
│ ≡ Banner │                      │  CTA:   [____]    │
│ ≡ Grid   │  [Rendered section]  │  Image: [upload]  │
│ [+ Add]  │                      │                   │
└──────────┴──────────────────────┴───────────────────┘
```

- Left: draggable section list (@dnd-kit)
- Center: live preview (same renderer as public page)
- Right: section-specific property editor
- Top: save draft, preview, publish, schedule, SEO settings

### 9.5 Homepage Builder

Same architecture as landing pages but:
- Single record (`homepage_sections` table or `landing_pages` with `is_homepage=true`)
- Only one active homepage configuration
- Sections replace hardcoded homepage blocks

### 9.6 Rendering Pipeline

```
GET /page/{slug}
  → Fetch landing_page + sections (ordered, visible only)
  → For dynamic sections (product_grid, etc.):
      → Resolve query server-side
      → Inject product/category data
  → Render `<SectionRenderer type={section.type} data={section.content} />`
  → Apply theme CSS variables from settings
```

### 9.7 Security
- `custom_html` sanitized with DOMPurify (whitelist tags)
- No `<script>` injection
- Image URLs validated against allowed domains
- Preview uses draft token (authenticated)

---

## 10. Deployment Architecture

### 10.1 Infrastructure

```
                    ┌─────────────┐
                    │   Cloudflare │ (DNS + CDN + SSL)
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │     Reverse Proxy      │ (Nginx / Caddy)
              │     paki.com           │
              └────────┬──────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
    │ Web App │  │ Admin   │  │ API     │
    │ :3000   │  │ :3001   │  │ :4000   │
    └────┬────┘  └────┬────┘  └────┬────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
    │PostgreSQL│  │  Redis  │  │S3 / R2  │
    │  :5432   │  │  :6379  │  │ Storage │
    └──────────┘  └─────────┘  └─────────┘
```

### 10.2 Minimum Server Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Node.js | 20 LTS | 22 LTS |
| PostgreSQL | 16 | 16 |
| Redis | 7 | 7 |

### 10.3 Environment Variables

```env
# App
NODE_ENV=production
APP_URL=https://paki.com
ADMIN_URL=https://paki.com/admin
API_URL=https://paki.com/api

# Database
DATABASE_URL=postgresql://user:pass@host:5432/paki_db

# Redis
REDIS_URL=redis://host:6379

# Auth
NEXTAUTH_SECRET=<random-64-char>
NEXTAUTH_URL=https://paki.com
JWT_SECRET=<random-64-char>

# Storage
STORAGE_PROVIDER=s3          # s3 | r2 | local
S3_BUCKET=paki-uploads
S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=                 # For R2/MinIO

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@paki.com

# Payment (SSLCommerz)
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=false
SSLCOMMERZ_SUCCESS_URL=https://paki.com/checkout/success
SSLCOMMERZ_FAIL_URL=https://paki.com/checkout/failed
SSLCOMMERZ_CANCEL_URL=https://paki.com/checkout/cancel
SSLCOMMERZ_IPN_URL=https://paki.com/api/v1/payments/sslcommerz/ipn

# Shipping
SHIPPING_DHAKA_INSIDE=70
SHIPPING_DHAKA_OUTSIDE=130

# Owner Seed (first deploy only)
OWNER_NAME=
OWNER_EMAIL=
OWNER_PHONE=
OWNER_PASSWORD=

# Monitoring (optional)
SENTRY_DSN=
```

### 10.4 Build & Deploy Commands

```bash
# Install
pnpm install

# Database
pnpm db:generate    # prisma generate
pnpm db:migrate     # prisma migrate deploy
pnpm db:seed        # seed demo data + owner account

# Build
pnpm build          # turbo build (web + admin)

# Start
pnpm start          # production servers

# Docker
docker compose up -d --build
```

### 10.5 Database Setup

```bash
# Create database
createdb paki_db

# Run migrations
npx prisma migrate deploy

# Seed (owner + demo categories + sample products)
npx prisma db seed
```

### 10.6 Domain & SSL

1. Point `paki.com` A record → server IP
2. Point `www.paki.com` CNAME → `paki.com`
3. Cloudflare proxy OR Caddy auto-SSL
4. Force HTTPS redirect

### 10.7 Storage Configuration

| Environment | Storage | Path |
|---|---|---|
| Development | Local filesystem | `/public/uploads/` |
| Production | S3 / Cloudflare R2 | `https://cdn.paki.com/` |

### 10.8 Owner Account Setup

```bash
# Option 1: Seed script (recommended first deploy)
OWNER_EMAIL=owner@paki.com OWNER_PASSWORD=<secure> pnpm db:seed

# Option 2: CLI command
pnpm cli create-owner --email owner@paki.com --phone 01XXXXXXXXX
```

### 10.9 Payment Live Configuration

1. Register at SSLCommerz → get Store ID + Password
2. Set `SSLCOMMERZ_IS_LIVE=true` in production `.env`
3. Configure IPN URL in SSLCommerz dashboard
4. Test with sandbox first

### 10.10 Backup Strategy

| What | Method | Frequency |
|---|---|---|
| PostgreSQL | `pg_dump` automated cron | Daily |
| Uploads (S3) | S3 versioning + cross-region | Continuous |
| Env/config | Encrypted vault (1Password etc.) | On change |
| Retention | 30 daily + 12 monthly | — |

### 10.11 Error Monitoring

- **Sentry** for frontend + API errors
- **Structured logging** (Pino) → file or Logtail
- **Uptime monitoring** (UptimeRobot / Better Stack)
- **Admin alert** on critical errors via notification system

---

## Implementation Phases

| Phase | Scope | Duration Est. |
|---|---|---|
| **Phase 1** | Project scaffold, DB schema, auth, RBAC | 3–4 days |
| **Phase 2** | Storefront core (home, shop, product, cart) | 4–5 days |
| **Phase 3** | Checkout, orders, payments, tracking | 3–4 days |
| **Phase 4** | Admin dashboard + catalog management | 5–6 days |
| **Phase 5** | Owner dashboard + permissions + theme | 3–4 days |
| **Phase 6** | Landing page builder + homepage builder | 4–5 days |
| **Phase 7** | Seller portal, reviews, coupons, notifications | 3–4 days |
| **Phase 8** | SEO, analytics, testing, deployment | 3–4 days |

**Total estimated: ~28–36 days of focused development**

---

## Pending from User (Required Before Theming)

- [ ] Primary Color
- [ ] Secondary Color
- [ ] Logo file
- [ ] Favicon file
- [ ] Phone number
- [ ] Email address
- [ ] Physical address

---

*Document version: 1.0 | Created: 2026-09-02 | Status: Phase 0 Complete — Ready for Phase 1*
