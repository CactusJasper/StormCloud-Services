# Base Nginx HTTP/3 Image
FROM ranadeeppolavarapu/nginx-http3:latest

RUN apk add openssl ca-certificates python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo

# Copy your certs.
COPY stormcloud-world.key /etc/ssl/private/
COPY stormcloud-world.pem /etc/ssl/

COPY nginx.conf /etc/nginx/
COPY h3.nginx.conf /etc/nginx/conf.d/
