# Development stage
FROM node:18 as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY ./ ./
ENV NODE_ENV development
CMD [ "./docker/api/development/entrypoint.sh" ]

# Builder stage
FROM development as builder
WORKDIR /app
# Build the app with devDependencies still installed from "development" stage
RUN npm run build
# Clear dependencies and reinstall for production (no devDependencies)
RUN rm -rf node_modules
RUN npm ci --only=production