FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY cert/certificate.cer /etc/nginx/cert/certificate.cer
COPY cert/private.key /etc/nginx/cert/private.key

EXPOSE 80 443