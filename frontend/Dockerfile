FROM node:latest AS builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.25.2-alpine-slim

# Copia la configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]