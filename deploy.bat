@echo off
echo 🚀 Starting Web Tools deployment process...

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building the project...
npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

REM Initialize Git repository (if not already done)
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
)

REM Add all files
echo 📁 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy: Web Tools multi-tool application"

echo.
echo 🎉 Local preparation complete!
echo.
echo 📋 Next steps:
echo 1. Create a GitHub repository at https://github.com/new
echo 2. Run these commands:
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git push -u origin main
echo 3. Go to https://vercel.com and import your repository
echo 4. Configure environment variables in Vercel dashboard
echo 5. Deploy!
echo.
echo 📖 See DEPLOYMENT_CHECKLIST.md for detailed instructions
echo 📖 See ADSENSE_SETUP.md for AdSense configuration
pause
