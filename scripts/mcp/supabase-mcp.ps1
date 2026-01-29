$ErrorActionPreference = 'Stop'

$function:GetEnvFromDotenv = {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Name
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $null
  }

  foreach ($rawLine in Get-Content -LiteralPath $Path) {
    $line = $rawLine.Trim()
    if ($line.Length -eq 0) { continue }
    if ($line.StartsWith('#')) { continue }

    $idx = $line.IndexOf('=')
    if ($idx -lt 1) { continue }

    $key = $line.Substring(0, $idx).Trim()
    if ($key -ne $Name) { continue }

    $value = $line.Substring($idx + 1).Trim()
    if ($value.Length -ge 2 -and $value.StartsWith('"') -and $value.EndsWith('"')) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    if ([string]::IsNullOrWhiteSpace($value)) { return $null }
    return $value
  }

  return $null
}

$token = $env:SUPABASE_ACCESS_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
  $token = & $GetEnvFromDotenv -Path '.env.local' -Name 'SUPABASE_ACCESS_TOKEN'
}
if ([string]::IsNullOrWhiteSpace($token)) {
  $token = & $GetEnvFromDotenv -Path '.env' -Name 'SUPABASE_ACCESS_TOKEN'
}
if ([string]::IsNullOrWhiteSpace($token)) {
  Write-Error 'SUPABASE_ACCESS_TOKEN is not set. Set it in your shell environment or .env.local, then restart Codex.'
  exit 1
}

$projectRef = 'dhtzybnkvpimmomzwrce'

npx -y @supabase/mcp-server-supabase@latest --project-ref=$projectRef --access-token=$token
