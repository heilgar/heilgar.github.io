---
title: "Установка RabbitMQ на Linux"
date: 2018-03-08
categories: 
  - "devops"
  - "rabbitmq"
tags: 
  - "rabbitmq"
---

Пакеты RabbitMQ поставляются системами CentOS/RHEL и Ubuntu/Debian. Но, как правило, такие пакеты устаревшие. Потому рекомендуется скачать и установить RabbitMQ вручную.

**Примечание**: Все действия руководства рекомендуется выполнять на свежем сервере, чтобы не нарушить работу запущенных ранее приложений и не вызвать сбой настроек.<!--more-->

### Установка RabbitMQ в CentOS/RHEL

Прежде чем приступить к установке RabbitMQ, нужно установить зависимости программы, одной из которых является Erlang. Однако, прежде всего необходимо обновить систему и стандартные приложения; для этого запустите:

`yum -y update`

Для установки Erlang используйте команды:

`# Add and enable relevant application repositories: # Note: We are also enabling third party remi package repositories. wget [http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm](http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm) wget [http://rpms.famillecollet.com/enterprise/remi-release-6.rpm](http://rpms.famillecollet.com/enterprise/remi-release-6.rpm) sudo rpm -Uvh remi-release-6*.rpm epel-release-6*.rpm # Finally, download and install Erlang: yum install -y erlang`

Теперь можно установить RabbitMQ:

`# Download the latest RabbitMQ package using wget: wget [http://www.rabbitmq.com/releases/rabbitmq-server/v3.2.2/rabbitmq-server-3.2.2-1.noarch.rpm](http://www.rabbitmq.com/releases/rabbitmq-server/v3.2.2/rabbitmq-server-3.2.2-1.noarch.rpm) # Add the necessary keys for verification: rpm --import [http://www.rabbitmq.com/rabbitmq-signing-key-public.asc](http://www.rabbitmq.com/rabbitmq-signing-key-public.asc) # Install the .RPM package using YUM: yum install rabbitmq-server-3.2.2-1.noarch.rpm`

### Установка RabbitMQ в Ubuntu 13/Debian 7

Процесс установки RabbitMQ в Ubuntu/Debian подобен установке в CentOS.

Для начала нужно обновить стандартные пакеты:

`apt-get    update apt-get -y upgrade`

Включите репозиторий приложения RabbitMQ:

`echo "deb [http://www.rabbitmq.com/debian/](http://www.rabbitmq.com/debian/) testing main" >> /etc/apt/sources.list`

Добавьте ключ проверки пакета:

`curl [http://www.rabbitmq.com/rabbitmq-signing-key-public.asc](http://www.rabbitmq.com/rabbitmq-signing-key-public.asc) | sudo apt-key add -`

Снова обновите систему:

`apt-get update`

Теперь можно загрузить и установить RabbitMQ:

`sudo apt-get install rabbitmq-server`

Чтобы при запуске было обработано максимальное количество подключений, откройте и отредактируйте в nano следующий конфигурационный файл:

`sudo nano /etc/default/rabbitmq-server`

Раскомментируйте строку limit (просто удалите символ #), а затем сохраните и закройте файл (CTRL+X + Y).

## Управление RabbitMQ

Как говорилось ранее, брокер RabbitMQ очень прост в использовании. В данном разделе приведены инструкции по управлению и настройке RabbitMQ.

### Включение консоли управления

Консоль управления RabbitMQ (RabbitMQ Management Console) – это один из доступных плагинов, позволяющий мониторить процессы сервера RabbitMQ через графический пользовательский веб-интерфейс.

При помощи этой консоли можно:

- Управлять обменом сообщениями, очередями сообщений, подключениями и пользователями;
- Отслеживать очереди сообщений, соединения и скорость передачи сообщений;
- Отправлять и получать сообщения;
- Отслеживать процессы Erlang и использование памяти;
- И многое другое.

Чтобы включить консоль RabbitMQ, запустите команду:

`sudo rabbitmq-plugins enable rabbitmq_management`

Теперь можно открыть консоль при помощи любого удобного браузера:

`[http://[IP_адрес_сервера]:15672/](http://[IP_адрес_сервера]:15672/).`

Стандартные имя и пароль – guest.

**Примечание**: Запустив консоль после запуска сервиса, не забудьте перезапустить его, чтобы обновить настройки.

### Управление RabbitMQ в CentOS/RHEL

После установки приложение RabbitMQ не будет запускаться автоматически при загрузке системы.

Чтобы настроить автозапуск RabbitMQ, выполните:

`chkconfig rabbitmq-server on`

Для запуска, остановки, перезапуска и проверки состояния используйте команды:

`# Запуск: /sbin/service rabbitmq-server start # Остановка: /sbin/service rabbitmq-server stop # Перезапуск: /sbin/service rabbitmq-server restart # Проверка статуса: /sbin/service rabbitmq-server status`

### Управление RabbitMQ в Ubuntu/Debian

Чтобы запустить, остановить перезапустить и проверит статус приложения в Ubuntu и Debian, используйте:

`# Запуск: service rabbitmq-server start # Остановка: service rabbitmq-server stop # Перезапуск: service rabbitmq-server restart # Проверка статуса: service rabbitmq-server status`

Готово! Теперь на сервере есть готовый к работе брокер сообщений.

 

Взято с:

[https://www.8host.com/blog/ustanovka-i-upravlenie-rabbitmq/](https://www.8host.com/blog/ustanovka-i-upravlenie-rabbitmq/)
