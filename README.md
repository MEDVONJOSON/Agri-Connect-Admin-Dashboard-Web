# Agri Connect Admin Dashboard (MVP)

This repository contains the core logic and components for the Admin Dashboard of the Agri Connect platform, extracted from the main mobile app codebase.

## Extracted Components

### Admin Pages
Located in `src/app/admin`:
- **Login (`login.tsx`)**: Authenticated entry point for admins.
- **Dashboard (`index.tsx`)**: Main overview page.
- **Order Management (`orders.tsx`)**: Managing orders.
- **User Management (`users.tsx`)**: Managing users.
- **Listings (`listings.tsx`)**: Managing product listings.
- **Models (`models.tsx`)**: Managing ML models (likely).

### Core Logic & Hooks
Located in `src/hooks`:
- **`useAdminStore.ts`**: Zustand store for managing admin state.

### Shared Components & Utilities
Located in `src/components` and `src/lib`:
- **`AgriConnectLogo.tsx`**: The main logo component.
- **`ui/Button.tsx`**: Reusable button component.
- **`lib/api.ts`**: API client configuration.
- **`lib/auth.ts`**: Authentication types and utilities.
- **`constants/Colors.ts`**: Color constants.

## Usage

This code is intended to be integrated into a web-based admin dashboard project (Next.js or React) or maintained as a separate module for the mobile app admin features.
