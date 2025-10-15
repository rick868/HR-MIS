Integration notes: Frontend + Backend

## Development

1. Start Django backend (from project root):

```bash
cd backend
# ensure virtualenv is activated and dependencies installed
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple whitenoise psycopg2-binary
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

2. Start frontend dev server (from project root):

```bash
cd frontend
npm install
# optional: set VITE_API_BASE_URL in .env (e.g. http://localhost:8000/api)
npm run dev
```

Vite config proxies `/api` to `http://127.0.0.1:8000`, so API calls from the frontend can use `/api/...` paths directly.

## Production

1. Build frontend:

```bash
cd frontend
npm run build
```

2. Collect static files and run Django (from project root):

```bash
cd backend
# ensure env vars set (SECRET_KEY, DB credentials)
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
```

Django is configured to serve the built frontend from `frontend/dist` via WhiteNoise and a small view that serves `index.html` for the root route.

## Notes

- Move secrets out of `settings.py` and into environment variables.
- Add `requirements.txt` for reproducible backend environment.
- Backend env vars needed: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`.
- Frontend env var (optional): `VITE_API_BASE_URL` (defaults to `/api`).
