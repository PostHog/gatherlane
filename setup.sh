#!/usr/bin/env bash
set -euo pipefail

REPOSITORY="https://github.com/PostHog/gatherlane.git"
NODE_VERSION="22.22.1"
DESTINATION="${GATHERLANE_DIR:-$PWD/gatherlane}"

fail() {
  printf '\nError: %s\n' "$1" >&2
  exit 1
}

confirm() {
  local answer
  printf '%s [y/N] ' "$1" >&2
  if ! read -r answer </dev/tty; then
    fail "An interactive terminal is required to install prerequisites."
  fi
  [[ "$answer" == [yY] || "$answer" == [yY][eE][sS] ]]
}

has_node() {
  command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1 &&
    node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit((major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major >= 23 ? 0 : 1)'
}

install_git() {
  printf '\nGit is required to clone Gatherlane.\n'
  confirm "Install Git using your system package manager?" || fail "Install Git and rerun this command."
  case "$(uname -s)" in
    Darwin)
      if ! command -v brew >/dev/null 2>&1; then
        fail "Install Git from https://git-scm.com/downloads/mac or install Homebrew, then rerun."
      fi
      brew install git
      ;;
    Linux)
      if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update
        sudo apt-get install -y git
      elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y git
      elif command -v pacman >/dev/null 2>&1; then
        sudo pacman -S --needed git
      else
        fail "Install Git with your distribution's package manager, then rerun."
      fi
      ;;
    *) fail "This script supports macOS and Linux. Windows users should use setup.ps1." ;;
  esac
  command -v git >/dev/null 2>&1 || fail "Git was not found after installation. Open a new terminal and rerun."
}

install_node() {
  printf '\nNode.js 20.19+ or 22.12+ and npm are required.\n'
  confirm "Download Node.js $NODE_VERSION to ~/.local/gatherlane-node?" || fail "Install Node.js from https://nodejs.org/ and rerun."

  local os arch archive temp expected actual node_dir
  case "$(uname -s)" in
    Darwin) os=darwin ;;
    Linux) os=linux ;;
    *) fail "This script supports macOS and Linux. Windows users should use setup.ps1." ;;
  esac
  case "$(uname -m)" in
    x86_64|amd64) arch=x64 ;;
    arm64|aarch64) arch=arm64 ;;
    *) fail "No Node.js binary is provided by this script for $(uname -m). Install Node.js manually and rerun." ;;
  esac
  archive="node-v${NODE_VERSION}-${os}-${arch}.tar.gz"
  temp=$(mktemp -d)
  trap 'rm -rf "$temp"' EXIT
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/${archive}" -o "$temp/$archive"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" -o "$temp/checksums"
  expected=$(awk -v file="$archive" '$2 == file {print $1}' "$temp/checksums")
  [[ -n "$expected" ]] || fail "Node.js checksum was not found."
  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$temp/$archive" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    actual=$(shasum -a 256 "$temp/$archive" | awk '{print $1}')
  else
    fail "A SHA-256 utility is required to verify Node.js."
  fi
  [[ "$actual" == "$expected" ]] || fail "Node.js download failed its checksum."
  tar -xzf "$temp/$archive" -C "$temp"
  node_dir="$HOME/.local/gatherlane-node/node-v${NODE_VERSION}-${os}-${arch}"
  mkdir -p "$(dirname "$node_dir")"
  if [[ ! -d "$node_dir" ]]; then
    mv "$temp/node-v${NODE_VERSION}-${os}-${arch}" "$node_dir"
  fi
  rm -rf "$temp"
  trap - EXIT
  export PATH="$node_dir/bin:$PATH"
  printf "For future sessions, use: export PATH=\"%s/bin:\$PATH\"\n" "$node_dir"
  has_node || fail "Node.js could not run on this system. Install it from https://nodejs.org/ and rerun."
}

main() {
  printf 'Gatherlane setup\n\nThe project will be cloned to %s.\n' "$DESTINATION"
  [[ ! -e "$DESTINATION" ]] || fail "Destination already exists: $DESTINATION. Choose another directory or remove it yourself."
  command -v curl >/dev/null 2>&1 || fail "Install curl and rerun."
  command -v git >/dev/null 2>&1 || install_git
  has_node || install_node
  printf '\nCloning Gatherlane and installing project packages...\n'
  git clone "$REPOSITORY" "$DESTINATION"
  cd "$DESTINATION"
  npm ci
  printf '\nStarting Gatherlane. Open the Local URL below. Press Ctrl+C to stop.\n'
  npm run dev
}

main "$@"
