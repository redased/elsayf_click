FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for psycopg2)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files (optional for API but good practice)
# RUN python manage.py collectstatic --noinput

EXPOSE 10000

# Start command — use PORT env var (Render sets it to 10000)
CMD gunicorn --bind 0.0.0.0:${PORT:-10000} core.wsgi:application
