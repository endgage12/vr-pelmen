#!/bin/bash

# Ожидаем, пока Nginx не будет готов принимать запросы
until curl -s http://nginx:80 > /dev/null; do
  echo "Ожидание Nginx..."
  sleep 2
done

# Генерируем сертификаты с помощью Certbot
certbot certonly --webroot -w /var/www/certbot -d krolpluskrosh.online -d www.krolpluskrosh.online

# Перезагружаем Nginx, чтобы он подхватил новые сертификаты
nginx -s reload