param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function ConvertFrom-SecureStringToPlainText([Security.SecureString]$Secure) {
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
  } finally {
    if ($bstr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

Write-Host "Phase 5 Account E2E verification" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor DarkGray
Write-Host "Credentials are only used for this process and are not echoed." -ForegroundColor DarkGray

$email = Read-Host "Test user email"
$pwdSecure = Read-Host "Test user password" -AsSecureString
$pwdPlain = ConvertFrom-SecureStringToPlainText $pwdSecure

try {
  $env:TEST_USER_EMAIL = $email
  $env:TEST_USER_PASSWORD = $pwdPlain
  $env:REUSE_EXISTING_SERVER = "true"
  $env:BASE_URL = $BaseUrl

  # Run only the Phase 5 account sweep in Chromium.
  pnpm -s exec node scripts/run-playwright.mjs test e2e/account-phase5.spec.ts --project=chromium
} finally {
  # Best-effort cleanup.
  Remove-Item Env:TEST_USER_EMAIL -ErrorAction SilentlyContinue
  Remove-Item Env:TEST_USER_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:REUSE_EXISTING_SERVER -ErrorAction SilentlyContinue
  Remove-Item Env:BASE_URL -ErrorAction SilentlyContinue

  $pwdPlain = $null
  $pwdSecure = $null
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}
