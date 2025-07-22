#!/bin/sh

# Get list packages to build from args. E.g. ./scripts/build-packages.sh api worker
packages=$@

if [ -z "$packages" ]; then
  echo "No packages to build"
  exit 1
fi

# Build each package into single .js file
for package in $packages; do
  bun build --minify-whitespace --minify-syntax --target bun --outfile ./output/$package/index.js packages/$package/src/index.ts
done
