# NewWay Tourist

Full-stack Da Lat tourism website built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase (Auth, Database, Storage).

## 1. Run locally (without Docker)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill env values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

4. Run SQL in `supabase/schema.sql`.
5. Enable Email provider in Supabase Auth.
6. Test `/register`, `/login`, `/dashboard`.

## 3. Run with Docker Compose

Requirements:
- Docker Desktop with `docker-compose` available.

Commands:

```bash
docker-compose up --build
```

App URL:

```text
http://localhost:3000
```

Stop:

```bash
docker-compose down
```

## 4. Manual Docker commands

Build image:

```bash
docker build -t newway-tourist:latest .
```

Run container:

```bash
docker run --name newway-tourist -p 3000:3000 --env-file .env.local newway-tourist:latest
```

## 5. Notes for VPS deployment

1. Copy project to VPS.
2. Create `.env.local` on VPS with production Supabase values.
3. Run `docker-compose up -d --build`.
4. Put Nginx or Caddy in front for domain + SSL.
