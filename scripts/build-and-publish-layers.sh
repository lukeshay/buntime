#!/bin/bash

set -euo pipefail

if [[ "${#}" -ne 1 ]]; then
  echo "Usage: ${0} <version>"
  echo "  version: The version of bun to use"
  exit 1
fi

VERSION="${1}"

./scripts/build-layers.sh "${VERSION}"
./scripts/publish-layers.sh "${VERSION}"
