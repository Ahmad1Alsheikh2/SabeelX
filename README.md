# SabeelX - Mentorship Platform

SabeelX is a modern web platform that connects mentees with experienced mentors across various fields. The platform facilitates meaningful mentorship relationships by providing a seamless way to find, connect with, and learn from industry experts.

## Features

- 🔍 Browse and filter mentors by expertise, price range, and availability
- 👤 Detailed mentor profiles with experience, education, and reviews
- 📅 Flexible session scheduling
- 💬 Direct messaging with mentors
- ⭐ Review and rating system
- 🔒 Secure authentication with Google
- 💰 Simple payment processing

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- MongoDB (Database)
- Mongoose (ODM)
- NextAuth.js (Authentication)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Google OAuth credentials

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/hamaadwmehal/sabeelx.git
cd sabeelx
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI="mongodb://localhost:27017/sabeelx"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
sabeelx/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions and configurations
│   ├── models/              # Mongoose data models
│   └── types/               # TypeScript type definitions
├── models/                  # Legacy Mongoose models
├── public/                  # Static assets
└── package.json            # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@sabeelx.com or join our Slack community.
