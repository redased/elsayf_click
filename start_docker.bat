@echo off
echo Starting e-learning platform with Docker...
docker-compose up -d --build
echo.
echo Application started! Access it at http://localhost:3000
pause
