---
title: "[Часть 2.1] RabbitMQ примеры кода Node.js"
date: 2018-03-08
categories: 
  - "devops"
  - "rabbitmq"
tags: 
  - "rabbitmq"
---

Будем следовать сценарию, использованному в предыдущей статье  "[Что такое RabbitMQ](http://thewebland.net/development/devops/what-is-rabbitmq/)?". Веб-сайт будет обрабатывать информацию и генерировать PDF-файл и отправлять его обратно пользователю. Создание PDF-файла и отправка электронной почты в этом сценарии займет несколько секунд. Если вы не знакомы с RabbitMQ и очередью сообщений, я бы рекомендовал вам прочитать [RabbitMQ для новичков - что такое RabbitMQ?](http://thewebland.net/development/devops/what-is-rabbitmq/) перед началом работы с этим руководством.

<!--more-->

## Начало работы с RabbitMQ и Node.js

Начните с загрузки клиентской библиотеки для Node.js. У разработчиков есть несколько вариантов клиентских библиотек AMQP. В этом примере будет использоваться [amqplib](https://github.com/squaremo/amqp.node/). Начните с добавления amqplib в качестве зависимости в файле package.json.

![](./images/overview-exchange-nodejs.png)

Для начала вам понадобится установить RabbitMQ.

- [Docker image](https://hub.docker.com/_/rabbitmq/)
- [Установка RabbitMQ на Linux](http://thewebland.net/development/devops/linux-rabbitmq-installation/)
- [Установка RabbitMQ на Windows](http://thewebland.net/development/devops/ustanovka-rabbitmq-na-windows/)

При запуске кода будет установлено соединение между RabbiMQ и вашим приложением. Будут объявлены и созданы очереди, если они еще не существуют, и, наконец, сообщение будет опубликовано. Метод публикации будет помещать сообщения в очередь, и если соединение отключено, повторно отправит сообщение позже. Пользователь подписывается на очередь. Сообщения обрабатываются один за другим и отправляются методу обработки PDF.

Новое сообщение будет публиковаться каждую секунду. Будет использоваться обмен по умолчанию, идентифицирующий пустую строку (""). Обмен по умолчанию означает, что сообщения направляются в очередь с именем, указанным routing\_key, если оно существует. (Обмен по умолчанию - это прямой обмен без имени)

Полный код можно скачать с [GitHub](https://gist.github.com/carlhoerberg/006b01ac17a0a94859ba).

### Загружаем AMQPLIB

```
# Access the callback-based API
var amqp = require('amqplib/callback_api');
var amqpConn = null;
```

### Настраиваем подключение

```
function start() {
  amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    }
    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });
    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}
```

Функция  `start` установит соединение с RabbitMQ. Если подключение закрыто или оборвано попробует его переподключить.

`amqpConn` будет удерживать соединение с каналами.

`whenConnected` метод будет вызван когда соединение будет установлено.

```
function whenConnected() {
  startPublisher();
  startWorker();
}
```

Функция `whenConnected` вызывает две другие, первая запускает паблишера, а вторая воркер (consumer / слушатель).

#### Запуск паблишера

```
var pubChannel = null;
var offlinePubQueue = [];
function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) return;
      ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    pubChannel = ch;
    while (true) {
      var m = offlinePubQueue.shift();
      if (!m) break;
      publish(m[0], m[1], m[2]);
    }
  });
}
```

`createConfirmChannel` открывает канал в режиме подтверждения. Канал в режиме подтверждения требует, чтобы каждое опубликованное сообщение было подписано ('acked' or 'nacked') сервером, тем самым указывая на то, что оно было обработано.

`offlinePubQueue` является внутренней очередью сообщений, которые не были отправлены, когда приложение не работало. Приложение проверяет эту очередь и отправляет сообщения в очередь, если сообщение добавляется в очередь.

#### Публикация сообщения

```
function publish(exchange, routingKey, content) {
  try {
    pubChannel.publish(exchange, routingKey, content, { persistent: true },
                      function(err, ok) {
                        if (err) {
                          console.error("[AMQP] publish", err);
                          offlinePubQueue.push([exchange, routingKey, content]);
                          pubChannel.connection.close();
                        }
                      });
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}
```

Функция `publish` опубликует сообщение для обмена с заданным ключом маршрутизации. При возникновении ошибки сообщение будет добавлено во внутреннюю очередь `offlinePubQueue`

#### CONSUMER

```
// A worker that acks messages only if processed successfully
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    ch.prefetch(10);
    ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("jobs", processMsg, { noAck: false });
      console.log("Worker is started");
    });
  });
}
```

`amqpConn.createChannel` создает канал в соединении. `ch.assertQueue` ожидает существование очереди. `ch.consume` устанавливает consumer с callback, который должен вызываться с каждым полученным им сообщением. Функция, вызываемая для каждого сообщения, называется `processMsg`

```
function processMsg(msg) {
  work(msg, function(ok) {
    try {
      if (ok)
        ch.ack(msg);
      else
        ch.reject(msg, true);
    } catch (e) {
      closeOnErr(e);
    }
  });
}
```

`processMsg` обрабатывает сообщение из очереди. Он вызовет функцию work и дождется ее завершения.

```
function work(msg, cb) {
  console.log("PDF processing of ", msg.content.toString());
  cb(true);
}
```

Функция `work` обрабатывает информацию из сообщения и созданет PDF. Это todo функция так как материал нацелен на ознакомление с RabbitMQ, а не генерацией PDF.

#### Закрываем подключение при возникновении ошибки

```
function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}
```

#### Публикация сообщений

```
setInterval(function() {
  publish("", "jobs", new Buffer("work work work"));
}, 1000);

start();
```

Новое сообщение будет публиковаться каждую секунду. Будет использоваться обмен по умолчанию, идентифицирующий пустую строку (""). Обмен по умолчанию означает, что сообщения направляются в очередь с именем, указанным routing\_key, если оно существует. (Обмен по умолчанию - это прямой обмен без имени)
