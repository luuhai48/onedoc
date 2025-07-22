ARG BUN_VERSION=1.2.18
FROM oven/bun:${BUN_VERSION}-alpine AS base
WORKDIR /app

FROM base AS build-backend
ENV NODE_ENV=production

COPY scripts/ /app/scripts/

# Only copy package.json and bun.lock to avoid unnecessary rebuilds
COPY package.json bun.lock /app/
COPY packages/shared/package.json /app/packages/shared/package.json
COPY packages/api/package.json /app/packages/api/package.json
COPY packages/worker/package.json /app/packages/worker/package.json

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy the rest of the project
COPY . .

# Build the packages into single file(s)
RUN ./scripts/build-packages.sh api worker

# Copy the built packages to the release stage
FROM base AS release

# Copy the built packages to the release stage
COPY --from=build-backend /app/output/ /app/output/

# Set the environment variables
EXPOSE 3000/tcp
ENV NODE_ENV=production
# Replace the CMD with the package to run
CMD ["bun", "run", "./output/api/index.js"]
