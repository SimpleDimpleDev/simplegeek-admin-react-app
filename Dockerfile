FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG SHOP_API_URL=https://api.simplegeek.ru
ARG AUTH_API_URL=https://auth.simplegeek.ru
RUN npm run build

# Nginx server
FROM nginx:alpine
WORKDIR /usr/share/nginx/

# Remove default nginx index page
RUN rm -rf html
RUN mkdir html
WORKDIR /
# Copy local nginx config
COPY ./nginx.conf /etc/nginx
# Copy compiled app statics
COPY --from=frontend-build ./app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
