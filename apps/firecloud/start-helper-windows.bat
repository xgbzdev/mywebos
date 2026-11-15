@echo off
setlocal
rem Starts the B2L helper for ALL B2L apps (Weather, Maps, Tumblr, AI apps, FireCloud...).
rem Keep this file in the B2L-helper folder, next to b2l-helper-armv7.
rem The helper already allows the servers of the built-in B2L apps.
rem EXTRA servers for newer apps go in the line below, separated by commas (no spaces):
rem   FireCloud: wksjtjligjvclvmyjgcd.supabase.co   Find My Device map: tile.openstreetmap.org
set "ALLOW=wksjtjligjvclvmyjgcd.supabase.co,tile.openstreetmap.org"

cd /d "%~dp0"
rem Always use the Windows tools (Git/Cygwin can put Linux "find"/"timeout" first)
set "FIND=%SystemRoot%\System32\find.exe"
set "WAIT=%SystemRoot%\System32\timeout.exe"
set "ADB=adb"
if exist "%USERPROFILE%\Downloads\platform-tools\adb.exe" set "ADB=%USERPROFILE%\Downloads\platform-tools\adb.exe"
set "LOG=/data/local/tmp/b2l-helper.log"
set "BIN=/data/local/tmp/b2l-helper"
set "PS=%TEMP%\b2l-ps.txt"

echo Connect the phone with the USB cable ("Remote debugging" must be on)...
"%ADB%" wait-for-device

rem 1. Stop a helper that is already running
"%ADB%" shell ps > "%PS%"
for /f "tokens=2" %%P in ('type "%PS%" ^| "%FIND%" "b2l-helper"') do (
  echo Stopping the running helper ^(%%P^)...
  "%ADB%" shell kill %%P
)
"%WAIT%" /t 2 /nobreak >nul

rem 2. Copy the helper to the phone (fixes "b2l-helper: not found")
if exist "%~dp0b2l-helper-armv7" (
  echo Copying the helper to the phone...
  "%ADB%" push "%~dp0b2l-helper-armv7" %BIN%
  "%ADB%" shell chmod 755 %BIN%
) else (
  echo WARNING: b2l-helper-armv7 is not in this folder; using the copy already on the phone.
)

rem 3. Start it for all B2L apps
"%ADB%" shell rm %LOG%
"%ADB%" shell %BIN% -daemon -log %LOG% -allow %ALLOW%
"%WAIT%" /t 3 /nobreak >nul
"%ADB%" shell cat %LOG% | "%FIND%" "listening" >nul
if errorlevel 1 (
  echo.
  echo The helper did not start. Log:
  "%ADB%" shell cat %LOG%
  echo Send a photo of this window.
) else (
  echo.
  echo Helper is running for all B2L apps.
  echo After every phone restart, run this file again.
)
pause
