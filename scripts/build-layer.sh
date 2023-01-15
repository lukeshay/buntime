#!/bin/bash

set -euo pipefail

if [[ "${#}" -ne 2 ]]; then
  echo "Usage: ${0} <version> <arch>"
  echo "  version: The version of bun to use"
  echo "  arch: The architecture of bun binary (x64 or aarch64)"
  exit 1
fi

VERSION="${1}"
ARCH="${2}"
MACHINE="${3:-linux}"

echo "Building layer for bun v${VERSION} for ${MACHINE} ${ARCH}"

LAYER_DIR="$(pwd)/build/layer-v${VERSION}-${ARCH}"
LAYER_ZIP="${LAYER_DIR}.zip"
ZIP="./build/bun-v${VERSION}-${MACHINE}-${ARCH}.zip"
UNZIP_DIR="./build/bun-${MACHINE}-${ARCH}"

rm -rf "${LAYER_DIR}" "${ZIP}" "${UNZIP_DIR}"
mkdir build || true

curl -L -o "${ZIP}" "https://github.com/Jarred-Sumner/bun-releases-for-updater/releases/download/bun-v${VERSION}/bun-${MACHINE}-${ARCH}.zip"

unzip "${ZIP}" -d "build"

mkdir -p "${LAYER_DIR}/bin" || true

cp -f "runtime/bootstrap" "runtime/index.ts" "${LAYER_DIR}"
cp -f "${UNZIP_DIR}/bun"  "${LAYER_DIR}/bin"

(cd "${LAYER_DIR}" && zip -r "${LAYER_ZIP}" .)

rm -rf "${ZIP}" "${UNZIP_DIR}" "${LAYER_DIR}"
