$ErrorActionPreference = 'Stop'

# Generates `designs/route-inventory.json` from Next.js App Router pages in `app/[locale]`.
# - Removes route groups like `(main)`
# - Removes parallel slots like `@modal`
# - Converts dynamic segments `[id]` -> `:id`
# - Converts catch-all `[...slug]` -> `*slug` and optional `[[...slug]]` -> `*?slug`
# - Converts intercepting segments like `(.)account` -> `account`

$root = Resolve-Path -LiteralPath 'app/[locale]'
$pages = Get-ChildItem -LiteralPath $root -Recurse -Filter 'page.tsx' -File

$routes = foreach ($file in $pages) {
  $dir = Split-Path -Parent $file.FullName
  $rel = $dir.Substring($root.Path.Length).TrimStart('\', '/')
  $segments = @()
  if ($rel -ne '') { $segments = $rel -split '[\\/]' | Where-Object { $_ -ne '' } }

  $urlSegs = New-Object System.Collections.Generic.List[string]

  foreach ($seg0 in $segments) {
    $seg = $seg0

    # Drop route groups like (main)
    if ($seg -match '^\([^)]+\)$') { continue }

    # Drop parallel route slots like @modal
    if ($seg -like '@*') { continue }

    # Intercepting routes like (.)account, (..)account, (...)account
    if ($seg -match '^\(\.\.\.\)(.+)$') { $seg = $Matches[1] }
    elseif ($seg -match '^\(\.\.\)(.+)$') { $seg = $Matches[1] }
    elseif ($seg -match '^\(\.\)(.+)$') { $seg = $Matches[1] }

    # Dynamic segments
    if ($seg -match '^\[\.\.\.(.+)\]$') { $urlSegs.Add('*' + $Matches[1]); continue }
    if ($seg -match '^\[\[\.\.\.(.+)\]\]$') { $urlSegs.Add('*?' + $Matches[1]); continue }
    if ($seg -match '^\[(.+)\]$') { $urlSegs.Add(':' + $Matches[1]); continue }

    $urlSegs.Add($seg)
  }

  if ($urlSegs.Count -eq 0) { '/' } else { '/' + ($urlSegs -join '/') }
}

$routes = $routes | Sort-Object -Unique

if (!(Test-Path -LiteralPath 'designs')) {
  New-Item -ItemType Directory -Path 'designs' | Out-Null
}

$routes | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 'designs/route-inventory.json'

Write-Host "Routes: $($routes.Count)"
