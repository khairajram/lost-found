# ==============================================================================
# Hackathon Software - Remaining Tools Installer Script
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting Installation of Remaining Hackathon Software   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$packages = @(
    @{ Name = "PyCharm Community Edition";    Id = "JetBrains.PyCharm.Community" },
    @{ Name = "IntelliJ IDEA Community";     Id = "JetBrains.IntelliJIDEA.Community" },
    @{ Name = "Power BI Desktop";            Id = "Microsoft.PowerBI" },
    @{ Name = "PostgreSQL 17";               Id = "PostgreSQL.PostgreSQL.17" },
    @{ Name = "MongoDB Server";              Id = "MongoDB.Server" },
    @{ Name = "MySQL Server";                Id = "Oracle.MySQL" },
    @{ Name = "Draw.io Desktop";             Id = "JGraph.Draw" }
)

foreach ($pkg in $packages) {
    Write-Host "`n----------------------------------------------------------" -ForegroundColor Yellow
    Write-Host " Installing: $($pkg.Name)..." -ForegroundColor Yellow
    Write-Host " Package ID: $($pkg.Id)" -ForegroundColor DarkCyan
    Write-Host "----------------------------------------------------------" -ForegroundColor Yellow
    
    # Run with full visible progress bars and user feedback
    winget install --id $pkg.Id --accept-package-agreements --accept-source-agreements
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  All Remaining Software Installations Complete!          " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
