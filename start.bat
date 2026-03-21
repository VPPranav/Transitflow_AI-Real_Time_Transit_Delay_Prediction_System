@echo off
echo Starting Transitflow AI...

echo Starting Backend...
start cmd /k "cd backend && python app.py"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both services have been started in new command prompt windows.
echo Close those windows to stop the services.
