# Safe removal of old JavaScript backend
# This script removes the old JS backend files after TS conversion is complete
# Run from root directory: .\remove-old-backend.ps1

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         BACKEND MIGRATION - SAFE OLD JS REMOVAL SCRIPT         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verify we're in the right directory
if (-not (Test-Path "nuonbackend" -PathType Container)) {
    Write-Host "❌ ERROR: nuonbackend folder not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Verified: Running from project root" -ForegroundColor Green
Write-Host ""

# Create backup before removal
Write-Host "📦 Creating backup of old backend files..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_old_backend_$timestamp"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "✅ Created backup directory: $backupDir" -ForegroundColor Green
}

# Backup each old backend folder
$foldersToBackup = @("controllers", "models", "routes", "services")

foreach ($folder in $foldersToBackup) {
    if (Test-Path $folder -PathType Container) {
        Write-Host "  📋 Backing up $folder/" -ForegroundColor Cyan
        Copy-Item -Path $folder -Destination "$backupDir\$folder" -Recurse -Force
        Write-Host "  ✅ Backed up: $backupDir\$folder" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== BACKUP COMPLETE ===" -ForegroundColor Green
Write-Host "Backup location: .\$backupDir" -ForegroundColor Yellow
Write-Host ""

# Confirm removal
Write-Host "⚠️  Ready to remove old JavaScript backend folders:" -ForegroundColor Yellow
Write-Host "   • controllers/" -ForegroundColor White
Write-Host "   • models/" -ForegroundColor White
Write-Host "   • routes/" -ForegroundColor White
Write-Host "   • services/ (old JS services only, if any)" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "⏸️  Continue with removal? (type 'YES' to proceed, any other key to cancel)"

if ($confirm -ne "YES") {
    Write-Host "❌ Removal cancelled by user" -ForegroundColor Yellow
    Write-Host "Backup preserved at: .\$backupDir" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "🗑️  REMOVING OLD BACKEND FILES..." -ForegroundColor Yellow

# Remove old backend folders
$foldersToRemove = @("controllers", "models", "routes")

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder -PathType Container) {
        Write-Host "  🗑️  Removing $folder/" -ForegroundColor Red
        Remove-Item -Path $folder -Recurse -Force
        Write-Host "  ✅ Removed: $folder/" -ForegroundColor Green
    }
}

# Optionally remove old services folder (if it exists and doesn't contain anything needed)
# Note: Some services like zoomService.js might be needed - check before removing
if (Test-Path "services" -PathType Container) {
    Write-Host "  ℹ️  Note: services/ folder still exists" -ForegroundColor Yellow
    Write-Host "  Please manually review services/ folder for any needed utilities" -ForegroundColor Yellow
    Write-Host "  (e.g., socket.io related code, utility functions)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ REMOVAL COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Run: npm install (to ensure all dependencies are correct)" -ForegroundColor White
Write-Host "2. Test the application:" -ForegroundColor White
Write-Host "   - Backend: npm start" -ForegroundColor White
Write-Host "   - Frontends: npm start (in each frontend folder)" -ForegroundColor White
Write-Host "3. Run end-to-end tests" -ForegroundColor White
Write-Host "4. If issues arise, restore from backup: .\$backupDir" -ForegroundColor White
Write-Host "5. Commit changes: git add . && git commit -m 'Remove old JS backend'" -ForegroundColor White
Write-Host ""
Write-Host "=== BACKUP INFO ===" -ForegroundColor Cyan
Write-Host "Location: .\$backupDir" -ForegroundColor Yellow
Write-Host "Retain this backup until you're confident everything works!" -ForegroundColor Yellow
Write-Host ""
