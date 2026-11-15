FireCloud 1.0 for B2L (Back To Life) – English by default, 8 languages
====================================

firecloud-pc.zip       B2L computers (talks to the server directly)
firecloud-mobile.zip   Firefox OS phones, from 1.1 (talks through the B2L helper)
firecloud-setup.sql    one-time server setup (Supabase)
start-helper-firecloud-windows.bat   starts the helper on the phone with FireCloud allowed

FireCloud is PRE-CONFIGURED for the B2L FireCloud server: no setup needed.

1. On a B2L computer (live version)
   - Marketplace > "Install a Firefox OS app" > From file (.zip) > firecloud-pc.zip
     (B2L builds after build-24 already include FireCloud).
   - Open FireCloud > Create account > Sign in.

2. On a Firefox OS phone (1.1 or newer)
   - Install firecloud-mobile.zip the same way you install your other B2L apps.
   - Connect the phone and double-click start-helper-firecloud-windows.bat
     (it starts the B2L helper with FireCloud's server allowed).
   - Open FireCloud > sign in with the same account.

Find My Device
   - Off by default. Turn it on per device in the "Find device" tab.
   - Each account can only see and ring its own devices (enforced by the server).
   - A phone reports its position while FireCloud is open (every 5 minutes) and
     plays the sound the next time FireCloud is open on it.

Limits on the free server: 10 MB per file, 100 MB per account (change in
firecloud-setup.sql and js/config.js). Photos are shrunk to 1600 px before upload.
