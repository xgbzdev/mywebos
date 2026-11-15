@echo off
rem Starts the B2L helper on the phone with FireCloud's server allowed.
rem Tries both possible names of the "extra allowed hosts" option, then a plain start.
set "HOSTS=wksjtjligjvclvmyjgcd.supabase.co,tile.openstreetmap.org"
set "ADB=adb"
if exist "C:\Users\%USERNAME%\Downloads\platform-tools\adb.exe" set "ADB=C:\Users\%USERNAME%\Downloads\platform-tools\adb.exe"
set "LOG=/data/local/tmp/b2l-helper.log"
echo Connect the phone with the USB cable ("Remote debugging" must be on)...
"%ADB%" wait-for-device

rem Stop a helper that is already running (otherwise: "address already in use")
for /f "tokens=2" %%P in ('"%ADB%" shell ps ^| find "b2l-helper"') do (
  echo Stopping the running helper ^(%%P^)...
  "%ADB%" shell kill %%P
)
timeout /t 2 >nul

for %%F in (hosts extra) do (
  "%ADB%" shell rm %LOG% 2^>/dev/null
  echo Trying option -%%F ...
  "%ADB%" shell /data/local/tmp/b2l-helper -daemon -log %LOG% -%%F %HOSTS%
  timeout /t 3 >nul
  "%ADB%" shell cat %LOG% | find "listening" >nul
  if not errorlevel 1 (
    echo.
    echo Helper is running with FireCloud allowed ^(option -%%F^).
    goto done
  )
)

echo Neither option worked, starting the helper without it...
"%ADB%" shell rm %LOG% 2^>/dev/null
"%ADB%" shell /data/local/tmp/b2l-helper -daemon -log %LOG%
timeout /t 3 >nul
"%ADB%" shell cat %LOG% | find "listening" >nul
if errorlevel 1 (
  echo.
  echo The helper did not start. Log:
  "%ADB%" shell cat %LOG%
  echo Send a photo of this window.
) else (
  echo.
  echo Helper is running, but WITHOUT FireCloud's server allowed.
  echo Send a photo of this window.
)

:done
echo.
"%ADB%" shell cat %LOG%
pause
