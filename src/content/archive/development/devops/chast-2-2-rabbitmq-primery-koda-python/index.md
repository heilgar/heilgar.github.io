---
title: "[Часть 2.2] RabbitMQ примеры кода Python"
date: 2018-03-08
categories: 
  - "devops"
  - "rabbitmq"
tags: 
  - "rabbitmq"
---

Будем следовать сценарию, использованному в предыдущей статье  "[Что такое RabbitMQ](http://thewebland.net/development/devops/what-is-rabbitmq/)?". Веб-сайт будет обрабатывать информацию и генерировать PDF-файл и отправлять его обратно пользователю. Создание PDF-файла и отправка электронной почты в этом сценарии займет несколько секунд. Если вы не знакомы с RabbitMQ и очередью сообщений, я бы рекомендовал вам прочитать [RabbitMQ для новичков - что такое RabbitMQ?](http://thewebland.net/development/devops/what-is-rabbitmq/) перед началом работы с этим руководством.

<!--more-->

## Начало работы с RabbitMQ и Python

Начните с загрузки клиентской библиотеки для Python. Рекомендуемой библиотекой для Python является [Pika](http://pika.readthedocs.io/en/latest/). Поместите pika == version в файл require.txt.

Для начала вам понадобится установить RabbitMQ.

- [Docker image](https://hub.docker.com/_/rabbitmq/)
- [Установка RabbitMQ на Linux](http://thewebland.net/development/devops/linux-rabbitmq-installation/)
- [Установка RabbitMQ на Windows](http://thewebland.net/development/devops/ustanovka-rabbitmq-na-windows/)

![](./images/overview-exchange-nodejs.png)

При запуске кода будет установлено соединение между RabbiMQ и вашим приложением. Будут объявлены и созданы очереди, если они еще не существуют, и, наконец, сообщение будет опубликовано. Метод публикации будет помещать сообщения в очередь, и если соединение отключено, повторно отправит сообщение позже. Пользователь подписывается на очередь. Сообщения обрабатываются один за другим и отправляются методу обработки PDF.

Новое сообщение будет публиковаться каждую секунду. Будет использоваться обмен по умолчанию, идентифицирующий пустую строку (""). Обмен по умолчанию означает, что сообщения направляются в очередь с именем, указанным routing\_key, если оно существует. (Обмен по умолчанию - это прямой обмен без имени)

```
# example_publisher.py
import pika, os, logging
logging.basicConfig()

# Parse CLODUAMQP_URL (fallback to localhost)
url = os.environ.get('CLOUDAMQP_URL', 'amqp://guest:guest@localhost/%2f')
params = pika.URLParameters(url)
params.socket_timeout = 5

connection = pika.BlockingConnection(params) # Connect to CloudAMQP
channel = connection.channel() # start a channel
channel.queue_declare(queue='pdfprocess') # Declare a queue
# send a message

channel.basic_publish(exchange='', routing_key='pdfprocess', body='User information')
print ("[x] Message sent to consumer")
connection.close()
```

```
# example_consumer.py
import pika, os, time

def pdf_process_function(msg):
  print(" PDF processing")
  print(" Received %r" % msg)

  time.sleep(5) # delays for 5 seconds
  print(" PDF processing finished");
  return;

# Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
url = os.environ.get('CLOUDAMQP_URL', 'amqp://guest:guest@localhost:5672/%2f')
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
channel = connection.channel() # start a channel
channel.queue_declare(queue='pdfprocess') # Declare a queue

# create a function which is called on incoming messages
def callback(ch, method, properties, body):
  pdf_process_function(body)

# set up subscription on the queue
channel.basic_consume(callback,
  queue='pdfprocess',
  no_ack=True)

# start consuming (blocks)
channel.start_consuming()
connection.close()
```

```
# example_consumer.py
import pika, os, logging

# Parse CLODUAMQP_URL (fallback to localhost)
url = os.environ.get('CLOUDAMQP_URL', 'amqp://guest:guest@localhost/%2f')
params = pika.URLParameters(url)
params.socket_timeout = 5
```

Загрузите клиентскую библиотеку и настройте параметры конфигурации. Значение DEFAULT\_SOCKET\_TIMEOUT равно 0,25 с, мы рекомендуем повысить этот параметр примерно до 5 с, чтобы избежать таймаута соединения, params.socket\_timeout = 5 Другие параметры подключения для Pika можно найти здесь: [http://pika.readthedocs.io/en/latest/modules/parameters.html](http://pika.readthedocs.io/en/latest/modules/parameters.html)

**Устанавливаем соединение** 

```
connection = pika.BlockingConnection(params) # Connect to CloudAMQP
```

`pika.BlockingConnection` устанавливает соединение с RabbitMQ сервером.

**Подключаем канал**

```
channel = connection.channel()
```

`connection.channel` создает канал в TCP соединении.

**Назначаем очередь**

```
channel.queue_declare(queue='pdfprocess') # Declare a queue
```

`channel.queue_declare`  создает очередь, на которую будет доставлено сообщение. В очереди будет указано имя pdfprocess.

#### Публикация сообщения

```
channel.basic_publish(exchange='', routing_key='pdfprocess', body='User information')
print("[x] Message sent to consumer")
```

channel.basic\_publish опубликует сообщение в канал с ключом маршрутизации и телом. Будет использоваться обмен по умолчанию, идентифицирующий пустую строку (""). Обмен по умолчанию означает, что сообщения направляются в очередь с именем, указанным routing\_key, если оно существует. (Обмен по умолчанию - это прямой обмен без имени).

**Закрываем соединение**  

```
connection.close()
```

### Consumer

```
def pdf_process_function(msg):
  print(" PDF processing")
  print(" Received %r" % msg)

  time.sleep(5) # delays for 5 seconds
  print(" PDF processing finished");
  return;
```

`pdf_process_function` такая же todo-функция как и в примере по [Node.js](http://thewebland.net/development/devops/rabbitmq-node-js/). Функция будет спать в течение 5 секунд, чтобы имитировать создание PDF.

**Функция которая будет вызываться для входящих сообщений** 

```
# create a function which is called on incoming messages
def callback(ch, method, properties, body):
  pdf_process_function(body)
```

Функция обратного вызова будет вызываться для каждого сообщения, полученного из очереди. Функция вызовет функцию, которая имитирует обработку PDF.

```
#set up subscription on the queue
channel.basic_consume(callback,
  queue='pdfprocess',
  no_ack=True)
```

`basic_consume` связывает сообщения с функцией обратного вызова консьюмера.

```
channel.start_consuming() # start consuming (blocks)
connection.close()
```

`start_consuming` начинает читать сообщения из очереди
