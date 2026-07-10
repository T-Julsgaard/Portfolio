@echo off
rem Opens the portfolio over http://localhost:8123 instead of file://.
rem YouTube refuses to stream into pages opened from file:// (embed error 153),
rem so the music bar only works when the site is served — this does exactly that.
cd /d "%~dp0"
start "portfolio server" /min python -m http.server 8123
timeout /t 1 /nobreak >nul
start "" "http://localhost:8123/"
