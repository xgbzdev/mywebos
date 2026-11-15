@echo off
rem Starts the B2L helper on the phone with FireCloud's server allowed.
set "PROJECT=wksjtjligjvclvmyjgcd"
set "ADB=adb"
if exist "C:\Users\%USERNAME%\Downloads\platform-tools\adb.exe" set "ADB=C:\Users\%USERNAME%\Downloads\platform-tools\adb.exe"
"%ADB%" wait-for-device
"%ADB%" shell /data/local/tmp/b2l-helper -daemon -log /data/local/tmp/b2l-helper.log -hosts %PROJECT%.supabase.co,tile.openstreetmap.org
timeout /t 3 >nul
"%ADB%" shell cat /data/local/tmp/b2l-helper.log
echo If you see "listening" above, open FireCloud on the phone.
pause
