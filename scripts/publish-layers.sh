#!/bin/bash

set -euo pipefail

if [[ "${#}" -ne 1 ]]; then
  echo "Usage: ${0} <version>"
  echo "  version: The version of bun to use"
  exit 1
fi

VERSION="${1}"

./scripts/publish-layer.sh "${VERSION}" arm64 al1
./scripts/publish-layer.sh "${VERSION}" arm64 al2
./scripts/publish-layer.sh "${VERSION}" x86_64 al1
./scripts/publish-layer.sh "${VERSION}" x86_64 al2
