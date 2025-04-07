# SabeelX

A platform for connecting mentors and mentees in the education space.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)
- Prisma (ORM)
- NextAuth.js (Authentication)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Update the following environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js
   - `NEXTAUTH_URL`: Your application URL (e.g., http://localhost:3000)
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string

5. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (email/password & Google OAuth)
- Role-based access control (Mentor/Mentee)
- Profile management
- Session management
- Secure password handling

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: Reusable React components
- `src/lib`: Utility functions and configurations
- `prisma`: Database schema and migrations

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT
