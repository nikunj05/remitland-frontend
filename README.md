# Modremit Platform

Welcome to the **Modremit** money transfer platform. This repository contains the Next.js frontend application for the Remitland platform, including the dashboard, compliance features, recipient management, and transaction flows.

## 🚀 Quick Start & Setup

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 2. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd remitland

# Install npm dependencies
npm install
```

### 3. Environment Configuration

Copy the example environment file to create your local environment configuration:

```bash
cp .env.example .env.local
```

Open `.env.local` and ensure the `NEXT_PUBLIC_API_URL` exactly matches your backend's local address (usually `http://127.0.0.1:8000` or `http://localhost:8000`).

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Running the Application

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). 
*(If port 3000 is taken, Next.js will typically assign `3001` or another available port. Check your terminal output!)*

## 🌐 Local Proxy & CORS

To avoid CORS issues during development, this Next.js app uses **API Rewrites**. 
Any request made to `/api/*` from the frontend will be automatically proxied to your Laravel backend URL defined in `NEXT_PUBLIC_API_URL`.

When writing new requests, **always use the relative path**:
```typescript
// ✅ DO THIS
const res = await fetch("/api/transactions");

// ❌ DO NOT DO THIS
const res = await fetch("http://localhost:8000/api/transactions");
```

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **Icons**: [Lucide React](https://lucide.dev/)
- **Real-time**: Socket.IO Client

## 📦 Project Structure

```text
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   ├── components/         # Reusable UI components (buttons, modals, tables)
│   ├── store/              # Redux slices and store configuration
│   ├── lib/                # Utility functions, Socket config
│   ├── data/               # Mock data for development
│   └── types/              # Global TypeScript definitions
├── public/                 # Static assets (images, fonts, sample files)
├── tailwind.config.ts      # Tailwind CSS configuration
└── next.config.ts          # Next.js configuration (includes API rewrites)
```
