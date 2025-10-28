# Frontend Environment Setup

## Environment Variables

Create a `.env.local` file in the client directory with:

```
VITE_BACKEND_URL=http://localhost:5000/api
```

For production, this will be updated to your backend Vercel URL.

## Development vs Production

- **Development**: `VITE_BACKEND_URL=http://localhost:5000/api`
- **Production**: `VITE_BACKEND_URL=https://your-backend.vercel.app/api`
