# 🏨 Hotel Reservation System UI

A modern, high-performance web interface for a Hotel Reservation System designed specifically for managing luxury and boutique hotels across Morocco. Built with a focus on premium aesthetics and seamless user experience, this project features both a customer-facing portal and a full-featured administrative dashboard.

## 🌟 Key Features

- **Dynamic Admin Dashboard**: A comprehensive control panel to monitor revenue, total bookings, occupancy rates, and active hotels.
- **Hotel & Guide Management**: Interactive tables and interfaces to easily add, edit, and organize hotel listings, pricing, and tourist guides.
- **Modern Tech Stack**: Powered by **React 18** and **Vite** for lightning-fast rendering and hot-module replacement.
- **Premium Design System**: Fully responsive and uniquely styled using **Tailwind CSS**, Radix UI primitives, and beautifully animated micro-interactions.
- **Robust Error Handling**: Safely engineered to prevent common React DOM layout shifts and translation extension crashes.

## 🚀 Quick Start

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```

## 🎨 Attributions & Design
The user interface draws inspiration from premium travel systems, offering a localized Moroccan flavor (currency formatted in MAD, spotlighting famous cities like Casablanca, Fes, and Marrakech).
*Original design concept adapted from Figma.*

for live demo : https://moroccanstay.ayman-bhg1.workers.dev/

## Laravel Backend

The project includes a Laravel API in `backend/` for the MoroccanStay use case:

- Customers can browse/search hotels, view details, reserve rooms, pay, and submit reviews.
- Mini admins can submit hotel information and room availability requests.
- Platform admins can manage hotels, rooms, reservations, guides, reviews, requests, and statistics.

Run the API:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Then run the frontend from the project root:

```bash
npm run dev
```

By default the frontend calls `http://127.0.0.1:8000/api` and falls back to browser localStorage if the Laravel server is not running.

Demo accounts:

- Admin: `admin@moroccanstay.com` / `admin123`
- Customer: `client@moroccanstay.com` / `client123`
- Guide: `hassan.guide@moroccanstay.com` / `guide123`
