# NewWay Tourist - AI Assistant Guidelines

This file contains guidelines for AI assistants (like Claude) when working on the **NewWay Tourist** project.

## 🚀 Commands
- **Install dependencies:** `npm install`
- **Run development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Start production server:** `npm run start`
- **Lint code:** `npm run lint`

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`
- **Backend/Auth/DB:** Supabase, PostgreSQL
- **Icons:** Lucide React

## 📐 Code Style & Conventions

### 1. Next.js App Router Rules
- By default, all components in `app/` are **Server Components**.
- Only add `'use client';` at the top of the file when needing interactivity (hooks like `useState`, `useEffect`, `onClick`, browser APIs).
- Keep Client Components as leaf nodes in the component tree as much as possible.
- Use **Server Actions** for data mutations (forms, POST requests) instead of creating standard API route handlers unless absolutely necessary.
- Data fetching should primarily happen in Server Components using `await`.

### 2. TypeScript Guidelines
- Use explicit typing for function arguments and return types where inference is not obvious.
- Define `interfaces` or `types` for all component props.
- Avoid using `any`. Use `unknown` if the type is truly dynamic.
- Prefer `interface` over `type` for object definitions to allow declaration merging if needed.

### 3. Styling (Tailwind CSS)
- Use standard Tailwind utility classes for all styling. Do not write custom CSS unless it's unavoidable (e.g., complex animations not supported by Tailwind).
- Use `cn()` utility (usually combining `clsx` and `twMerge`) when conditionally merging Tailwind classes to prevent style conflicts.
- Adhere to the established color palette (e.g., primary, secondary, destructive) defined in `tailwind.config.ts`.
- Ensure responsive design using Tailwind's `sm:`, `md:`, `lg:`, `xl:` prefixes. Mobile-first approach is preferred.

### 4. Component Structure
- **Pages & Layouts:** Place inside `app/` directory according to route structure.
- **UI Components:** Reusable components (Buttons, Inputs, Cards) go in `components/`.
- **Naming Convention:** Use PascalCase for React component files (e.g., `TourCard.tsx`) and camelCase for utility functions (e.g., `formatCurrency.ts`).
- Export components as `default` for pages/layouts (Next.js requirement) but prefer `named exports` for reusable UI components.

### 5. Supabase Integration
- Use `@supabase/ssr` for fetching data securely on the server.
- Ensure proper use of Supabase Auth middleware to protect routes (especially `/dashboard` for admin or `/profile` for users).
- When querying database entities (`tours`, `bookings`, `tour_schedules`), handle potential errors explicitly and log them.

## 📝 Error Handling & Logging
- Always use `try/catch` blocks for asynchronous operations (database calls, external APIs).
- Return standard error objects or use Next.js `notFound()` or `redirect()` where appropriate in Server Components.

## 🤝 AI Agent Directives
- **Always analyze existing code** before generating new files to match the current style.
- **Do not introduce unnecessary dependencies** without explicit user permission.
- **Format code properly** with 2 spaces for indentation.
- **Write descriptive commit messages** or summaries when completing tasks.
