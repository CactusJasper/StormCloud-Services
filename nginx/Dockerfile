# Base Nginx HTTP/3 Image
FROM nginx:1.20.1-alpine

# Copy your certs.
COPY stormcloud-world.key /etc/ssl/private/
COPY stormcloud-world.pem /etc/ssl/
COPY storm-cloud.key /etc/ssl/private/
COPY storm-cloud.pem /etc/ssl/

#COPY nginx.conf /etc/nginx/
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/
