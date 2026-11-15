@echo off
rem Starts the B2L helper on the phone with FireCloud's server allowed (-allow).
set "ALLOW=wksjtjligjvclvmyjgcd.supabase.co,tile.openstreetmap.org"
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

"%ADB%" shell rm %LOG% 2^>/dev/null
"%ADB%" shell /data/local/tmp/b2l-helper -daemon -log %LOG% -allow %ALLOW%
timeout /t 3 >nul
"%ADB%" shell cat %LOG% | find "listening" >nul
if errorlevel 1 (
  echo.
  echo The helper did not start. Log:
  "%ADB%" shell cat %LOG%
  echo Send a photo of this window.
) else (
  echo.
  echo Helper is running with FireCloud allowed. Open FireCloud on the phone.
  echo After every phone restart, run this file again.
)
pause
