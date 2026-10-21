@echo off
setlocal
cd /d "%~dp0"

:: Test for Administrator rights
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :run_install
)

echo ==============================================================================
echo                      ADMINISTRATOR PRIVILEGES REQUIRED
echo ==============================================================================
echo.
echo  The remaining software packages (PyCharm, IntelliJ, Power BI, Databases)
echo  require Windows Administrator permissions to install.
echo.
echo  To run this installer:
echo    1. Close this window.
echo    2. RIGHT-CLICK on "install_remaining.bat"
echo    3. Select "Run as administrator"
echo    4. Click "Yes" when Windows asks for permission.
echo.
echo ==============================================================================
echo.
pause
exit /b

:run_install
title Hackathon Software Installer
cls
echo ==============================================================================
echo           RUNNING HACKATHON SOFTWARE INSTALLER AS ADMINISTRATOR
echo ==============================================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install_remaining.ps1"
echo.
echo All installations finished!
pause
