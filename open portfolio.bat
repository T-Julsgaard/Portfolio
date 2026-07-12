@echo off
rem Opens the portfolio over http://localhost:8123 instead of file://.
rem YouTube refuses to stream into pages opened from file:// (embed error 153),
rem so the music bar only works when the site is served — this does exactly that.
cd /d "%~dp0"

rem Stop any server a previous run of THIS script left behind, so the fresh one
rem serves this exact folder (and frees port 8123 to rebind). Harmless if none.
taskkill /f /fi "WINDOWTITLE eq portfolio server*" >nul 2>&1

rem Start the static server (serves the live files straight from disk).
start "portfolio server" /min python -m http.server 8123
timeout /t 1 /nobreak >nul

rem The ?v=%RANDOM% cache-buster makes the browser fetch a FRESH copy every launch
rem instead of re-showing a stale cached page or just re-focusing an old tab — that
rem is why edits sometimes "didn't launch". A new URL each time forces a real load.
start "" "http://localhost:8123/index.html?v=%RANDOM%"
