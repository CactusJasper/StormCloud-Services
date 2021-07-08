# Base Nginx HTTP/3 Image
FROM ranadeeppolavarapu/nginx-http3:latest

# Copy your certs.
COPY stormcloud-world.key /etc/ssl/private/
COPY stormcloud-world.pem /etc/ssl/

COPY nginx.conf /etc/nginx/
COPY h3.nginx.conf /etc/nginx/conf.d/
