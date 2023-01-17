#!/bin/bash

set -euo pipefail

if [[ "${#}" -ne 3 ]]; then
  echo "Usage: ${0} <version> <arch> <linux>"
  echo "  version: The version of bun to use"
  echo "  arch: The architecture the lamba layer needs to support (x86_64 or arm64)"
  echo "  linux: The Amazon linux distribution the lamba layer needs to support (al1 or al2)"
  exit 1
fi

VERSION="${1}"
ARCH="${2}"
LINUX="${3}"

RUNTIME="provided"
NAME_VERSION="$(echo "${VERSION}" | sed 's/\./_/g')"

if [[ "${LINUX}" == "al2" ]]; then
  RUNTIME="provided.al2"
fi

echo "Publishing layer for bun v${VERSION} for ${LINUX} ${ARCH}"

aws lambda publish-layer-version --compatible-runtimes "${RUNTIME}" --output text --compatible-architectures "${ARCH}" --layer-name "Buntime-${ARCH}-${LINUX}-v${NAME_VERSION}" --zip-file "fileb://build/layer-v${VERSION}-${ARCH}.zip" | cat
