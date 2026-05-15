# Dalat Trails

Website du lịch Đà Lạt dùng Next.js App Router, TypeScript, Tailwind CSS và Supabase cho Auth, Database, Storage.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu hình Supabase

1. Tạo project trên Supabase.
2. Copy `.env.example` thành `.env.local`.
3. Điền:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Mở Supabase SQL Editor và chạy toàn bộ file `supabase/schema.sql`.
5. Vào Authentication, bật Email provider.
6. Đăng ký tại `/register`, sau đó vào `/dashboard`.

## Storage

File SQL tạo bucket public `tour-images` và policy cho user đã đăng nhập upload ảnh tour trong dashboard.

## Deploy gợi ý

- Build kiểm tra: `npm run build`.
- Docker bước tiếp theo: thêm `Dockerfile` dùng Node 20, build Next.js, expose port `3000`.
- Docker Compose bước tiếp theo: tạo service app, mount `.env.production`, reverse proxy qua Nginx/Caddy trên VPS.
