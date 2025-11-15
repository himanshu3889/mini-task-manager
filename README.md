# Mini Task Manager

Simple task management app with React frontend and Django backend.

## Tech Stack

**Frontend:**
- React + TypeScript - wanted type safety, React is familiar
- Vite - fast dev server, better than Create React App
- Redux Toolkit - needed global state for auth and tasks
- Material-UI - saves time on styling, looks decent out of the box
- Axios - simple HTTP client

**Backend:**
- Django + DRF - built-in auth, admin panel, quick to set up
- PostgreSQL - used it before, reliable
- JWT tokens - stateless auth, works well with React

**Why these choices:**
Django handles auth and admin without extra work. React + TypeScript catches bugs early. MUI speeds up UI work. Could've used SQLite for simpler setup, but PostgreSQL is better for real apps.

## Setup

### Backend

1. Install PostgreSQL and make sure it's running
2. Create a `.env` file in the root:
   ```
   DB_NAME=taskmanager
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   SECRET_KEY=your-secret-key-here
   ```
3. Go to backend folder:
   ```bash
   cd backend
   ```
4. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or: source venv/bin/activate  # Mac/Linux
   ```
5. Install packages:
   ```bash
   pip install -r requirements.txt
   ```
6. Run migrations:
   ```bash
   python manage.py migrate
   ```
7. Start server:
   ```bash
   python manage.py runserver
   ```

Backend runs on http://localhost:8000

### Frontend

1. Go to frontend folder:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

Frontend runs on http://localhost:5173

### Docker (Alternative)

If you have Docker installed:
```bash
docker-compose up
```

This starts everything - database, backend, and frontend.

## Time & Trade-offs

**Time spent:** ~3 hours

**Trade-offs made:**
- Used PostgreSQL instead of SQLite - more setup but closer to production
- JWT tokens expire after 7 days - convenient for dev, might be too long for production
- No password reset - would add this in a real app
- MUI instead of custom CSS - faster to build, less unique looking
- Redux instead of Context API - more boilerplate but easier to debug
- No tests - would add them for a real project
