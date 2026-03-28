# Stage 1: Build the Angular app
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy custom nginx configuration to support Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from Stage 1
COPY --from=build /app/dist/fe/browser/ /usr/share/nginx/html/

# Fix permissions for Nginx worker
RUN chmod -R a+rX /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
