This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file:
```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

3. Run development server:
```bash
bun run dev
```

The frontend will connect to the FastAPI backend at `http://localhost:8000`