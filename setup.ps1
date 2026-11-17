$ErrorActionPreference = 'Stop'
$destination = if ($env:GATHERLANE_DIR) { $env:GATHERLANE_DIR } else { Join-Path (Get-Location) 'gatherlane' }

function Refresh-Path {
    $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
        [System.Environment]::GetEnvironmentVariable('Path', 'User') + ';' + $env:Path
}

function Test-Node {
    if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
        return $false
    }
    $version = [version](& node -p 'process.versions.node')
    return (($version.Major -eq 20 -and $version.Minor -ge 19) -or
        ($version.Major -eq 22 -and $version.Minor -ge 12) -or $version.Major -ge 23)
}

function Install-Prerequisite($name, $id) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "Install $name manually, then run this command again. Windows Package Manager (winget) was not found."
    }
    $answer = Read-Host "$name is required. Install it with Windows Package Manager? This accepts the package and source agreements. [y/N]"
    if ($answer -notmatch '^(y|yes)$') { throw "Install $name manually, then run this command again." }
    & winget install --id $id --exact --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) { throw "$name installation failed. Install it manually and try again." }
    Refresh-Path
}

Write-Host "Gatherlane setup`n`nThe project will be cloned to $destination."
if (Test-Path -LiteralPath $destination) { throw "Destination already exists: $destination. Choose another directory or remove it yourself." }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Install-Prerequisite 'Git' 'Git.Git' }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git was not found after installation. Open a new terminal and try again.' }
if (-not (Test-Node)) { Install-Prerequisite 'Node.js LTS' 'OpenJS.NodeJS.LTS' }
if (-not (Test-Node)) { throw 'A compatible Node.js and npm were not found. Open a new terminal or install Node.js from https://nodejs.org/ and try again.' }

Write-Host "`nCloning Gatherlane and installing project packages..."
& git clone https://github.com/PostHog/gatherlane.git $destination
if ($LASTEXITCODE -ne 0) { throw 'Clone failed. Check repository access and your internet connection.' }
Set-Location -LiteralPath $destination
& npm.cmd ci
if ($LASTEXITCODE -ne 0) { throw 'Package installation failed. Run npm ci in the project folder to retry.' }
Write-Host "`nStarting Gatherlane. Open the Local URL below. Press Ctrl+C to stop."
& npm.cmd run dev
if ($LASTEXITCODE -ne 0) { throw 'The development server failed to start.' }
