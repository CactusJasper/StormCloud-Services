# Base Nginx HTTP/3 Image
FROM nginx:1.20.1-alpine

# Copy your certs.
COPY stormcloud-world.key /etc/ssl/private/
COPY stormcloud-world.pem /etc/ssl/

COPY nginx.conf /etc/nginx/
COPY h2.nginx.conf /etc/nginx/conf.d/
