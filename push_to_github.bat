@echo off
title Push PharmaPulse to GitHub
echo =====================================================================
echo  Pushing PharmaPulse to https://github.com/VIJAY-17-10/Pharmapulse.git
echo =====================================================================
echo.

set PATH=C:\Users\ELCOT\mingit\cmd;C:\Users\ELCOT\nodejs;%PATH%
cd /d "%~dp0"

echo Current git status:
git status

echo.
echo Pushing branch 'main' to origin...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================================
    echo  SUCCESS! PharmaPulse repository successfully pushed to GitHub!
    echo  Repository: https://github.com/VIJAY-17-10/Pharmapulse
    echo =====================================================================
) else (
    echo.
    echo If GitHub requested credentials, you can also authenticate using a
    echo GitHub Personal Access Token (PAT) with repo access from:
    echo https://github.com/settings/tokens
)

pause
