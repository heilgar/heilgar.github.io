---
title: "Установка RabbitMQ на Windows"
date: 2018-03-08
categories: 
  - "devops"
  - "rabbitmq"
tags: 
  - "rabitmq"
---

Рассмотрим как устанавливать RabbitMQ на Windows

<!--more-->

1\. Скачать и установить последнюю версию Erlang [http://www.erlang.org/download.html](http://www.erlang.org/download.html "http://www.erlang.org/download.html")

2\. Скачать и установить последнюю версию RabbitMQ [https://www.rabbitmq.com/install-windows.html](https://www.rabbitmq.com/install-windows.html "https://www.rabbitmq.com/install-windows.html")

3\. В установленной директории RabbitMQ создать две папки: conf — для конфига — `C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\conf` base — база данных и логи — `C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\base` В папку conf положить конфиг файл (взять из etc) и переименовать его в rabbitmq.config

4\. Установить переменные окружения для — конфиг файла — RABBITMQ\_CONFIG\_FILE `C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\conf\rabbitmq` — логов и базы данных — RABBITMQ\_BASE `C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\base`

Детали здесь [https://www.rabbitmq.com/relocate.html](https://www.rabbitmq.com/relocate.html "https://www.rabbitmq.com/relocate.html")

5\. Проверить не занят ли порт по умолчанию командой `netstat -ano | find "5672"` Последнее число при выводе покажет ID процесса, который занял порт

Если порт занят, заменить на другой в конфиге rabbitmq.config: `{tcp_listeners, [{"127.0.0.1", 5673},{"::1", 5673}]}`

6\. Перезапустить RabbitMQ сервис, чтобы изменения вступили в силу

7\. Запустить сервис (из папки sbin) `rabbitmq-service.bat`

8\. Проверить статус (из папки sbin) `rabbitmqctl.bat status`

9\. Установить менеджмент плагин командой `rabbitmq-plugins.bat enable rabbitmq_management`

10\. Рестартуем сервис RabbitMQ `rabbitmq-service.bat stop` `rabbitmq-service.bat start`

11\. Заходим в админку RabbitMQ: [http://localhost:15672](http://localhost:15672/ "http://localhost:15672") `(guest/guest)`

Источник: [https://afedyanin.wordpress.com/2014/11/06/rabbitmq-how-to-install/](https://afedyanin.wordpress.com/2014/11/06/rabbitmq-how-to-install/)
