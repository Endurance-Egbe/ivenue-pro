$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot 'backend'
$mobilePath = Join-Path $projectRoot 'mobile'
$backendPython = Join-Path $backendPath '.venv\Scripts\python.exe'
$lanIp = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi' -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $lanIp) {
    $lanIp = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.IPAddress -notlike '172.*' } |
        Select-Object -First 1 -ExpandProperty IPAddress
}

if (-not $lanIp) {
    throw 'Could not find a LAN IP address for the Expo device. Connect this computer to Wi-Fi or Ethernet and try again.'
}

if (-not (Test-Path $backendPython)) {
    throw "Backend virtual environment not found at $backendPython"
}

if (-not (Test-Path (Join-Path $mobilePath 'package.json'))) {
    throw "Mobile app not found at $mobilePath"
}

$backendCommand = "Set-Location -LiteralPath '$backendPath'; & '$backendPython' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
$mobileCommand = "`$env:EXPO_PUBLIC_API_URL = 'http://$lanIp`:8000'; Set-Location -LiteralPath '$mobilePath'; npm run start -- --port 8082"

Start-Process powershell.exe -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy', 'Bypass',
    '-Command', $backendCommand
) -WindowStyle Normal

Start-Process powershell.exe -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy', 'Bypass',
    '-Command', $mobileCommand
) -WindowStyle Normal

Write-Host 'iVenue development services are starting:' -ForegroundColor Green
Write-Host '  Backend:  http://127.0.0.1:8000'
Write-Host "  Device API: http://${lanIp}:8000"
Write-Host '  API docs: http://127.0.0.1:8000/docs'
Write-Host '  Mobile:   http://localhost:8082 (or scan the Expo QR code)'
