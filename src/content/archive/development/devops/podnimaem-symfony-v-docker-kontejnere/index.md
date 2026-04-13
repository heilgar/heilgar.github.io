---
title: "Поднимаем Symfony в Docker контейнере"
date: 2017-11-10
categories: 
  - "devops"
  - "docker"
---

В примере проекта будет создано очень простое приложение Symfony с обычной настройкой Docker и следующими контейнерами:

- Nginx webserver.
- PHP 7.1.
- Простой контейнер для Composer.

Приложение Symfony будет храниться в папке app, а структура файлов проекта будет выглядеть так:

```
symfony-docker-test
    app
    docker
        php
            Dockerfile
            php.ini
        nginx
            app.conf
    docker-compose.yml
```

Шаг с установкой Symfony я пропущу ([как установить Symfony?](https://symfony.com/doc/current/setup.html)), так как скорее всего вы уже знаете как это делать. Цель статьи показать как запустить Symfony в контейнере Docker.

## Docker контейнеры

_docker-compose.yml_

```
version: '2'  
services:  
  php:
    build: ./docker/php/
    environment:
      TIMEZONE: Europe/Kiev
    volumes:
      - ./docker/php/php.ini:/usr/local/etc/php/php.ini:ro
      - ./app:/var/www/app
    working_dir: /var/www/app

  webserver:
    image: nginx:1.11
    depends_on:
      - php
    volumes_from:
      - php
    volumes:
      - ./docker/nginx/app.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - 8080:80

  composer:
    image: composer:1.4
    volumes_from:
      - php
    working_dir: /var/www/app
```

### PHP Контейнер

_Dockerfile в директории docker/php_

```
FROM php:7.1-fpm

# Install recommended extensions for Symfony
RUN apt-get update && apt-get install -y \  
        libicu-dev \
    && docker-php-ext-install \
        intl \
        opcache \
    && docker-php-ext-enable \
        intl \
        opcache

# Permission fix
RUN usermod -u 1000 www-data
```

_php.ini_

```
date.timezone = ${TIMEZONE}  
short_open_tag = Off  
log_errors = On  
error_reporting = E_ALL  
display_errors = Off  
error_log = /proc/self/fd/2  
memory_limit = 256M

; Optimizations for Symfony, as documented on http://symfony.com/doc/current/performance.html
opcache.max_accelerated_files = 20000  
realpath_cache_size = 4096K  
realpath_cache_ttl = 600
```

Конфигурация Nginx vhost:

`docker/nginx/app.conf`

```
upstream php-upstream {  
    server php:9000;
}

server {  
    root /var/www/app/web;
    listen 80;
    server_tokens off;

    location / {
        try_files $uri @rewriteapp;
    }

    location @rewriteapp {
        rewrite ^(.*)$ /app.php/$1 last;
    }

    location ~ ^/(app|app_dev|app_test|config)\.php(/|$) {
        fastcgi_pass php-upstream;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS off;
    }
}
```

### Запуск контейнеров

Достаточно поднятся в корень проекта (там где лежит docker-compose.yml) и запустить команду

```
docker-compose up -d
```

Теперь приложение должно быть доступно по адресу http://127.0.0.1:8080, и вы должны увидеть эту страницу:

![](./images/symfony-docker-welcome.png)

Все настройка закончена и можно приступать к работе :)

В следующей статье я расскажу как [оптимизировать скорость работы Symfony в Docker контейнере](http://thewebland.net/development/devops/uskoryaem-rabotu-symfony-prilozheniya-v-docker/) для локального окружения.

**P.S.** Напишите в комментариях с какими проблемами вы столкнулись и я попробую вам помочь.

**P.S.S:** Github [https://github.com/heilgar/docker-php](https://github.com/heilgar/docker-php)
