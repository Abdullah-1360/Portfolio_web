@echo off
echo Building Flutter web app for Vercel deployment...
echo.

REM Clean previous builds
echo Cleaning previous builds...
flutter clean

REM Get dependencies
echo Getting dependencies...
flutter pub get

REM Build for web with HTML renderer
echo Building web app...
flutter build web --release --web-renderer html

echo.
echo Build completed! The build output is in the build/web directory.
echo You can now deploy to Vercel using the vercel.json configuration.
echo.
pause