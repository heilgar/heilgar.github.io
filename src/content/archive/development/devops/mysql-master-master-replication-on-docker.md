---
title: "Мастер-мастер репликация MySql на Docker"
date: 2017-10-22
categories: 
  - "data-bases"
  - "devops"
  - "docker"
---

Вы когда-нибудь задумывались, почему Docker так популярен? Docker позволяет легко развернуть необходимое вам окружение в считанные минуты и по мере необходимости добавлять в ваше окружение нужный функционал и быстро его разворачивать практически на любой “машине”\*.

<!--more-->

В этой статье я собираюсь показать как настроить Master-Master репликацию между двумя Docker контейнерами Mysql.

Требования к железу для установки докер (eng): [https://docs.docker.com/datacenter/ucp/1.1/installation/system-requirements/](https://docs.docker.com/datacenter/ucp/1.1/installation/system-requirements/)

Инструкция по установке, где вы можете посмотреть как установить Docker для вашей ОС: [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/)

## **Шаг 1 - Подготовка структуры папок и конфигураций mysql**

Прежде всего мы создадим структуру каталогов, как показано ниже, для каждого, отдельно взятого mysql сервера.

~/server#/backup - Тут будут лежать необходимые нам sql файлы

~/server#/data - Точка входа, откуда будем монтировать данные. При каждом перезапуске, в этом каталоге будут сохраняться данные.

~/server#/log - Логи mysql сервера

~/server#/conf.d - Каталог будет содержать файлы конфигурации.

**Конфигурация mySQL:**

~/server1/conf.d/server1.cnf:

```
[mysqld]
server-id = 101
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = mydata
bind-address = 0.0.0.0 
character_set_server = utf8
collation_server = utf8_general_ci
 
[mysql]
 default_character_set = utf8
```

~/server1/backup/initdb.sql

```
use mysql;
create user 'replicator'@'%' identified by 'repl1234or';
grant replication slave on *.* to 'replicator'@'%'; 
FLUSH PRIVILEGES;
SHOW MASTER STATUS;
SHOW VARIABLES LIKE 'server_id';

```

~/server2/conf.d/server2.cnf

```
[mysqld]
server-id = 102 # Remember this is only Integer per official documentation
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = mydata
bind-address = 0.0.0.0
character_set_server = utf8
collation_server = utf8_general_ci
[mysql]
default_character_set = utf8
```

~/server2/backup/initdb.sql

```
use mysql;
create user 'replicator'@'%' identified by 'repl1234or';
grant replication slave on *.* to 'replicator'@'%'; 
FLUSH PRIVILEGES;
SHOW MASTER STATUS;
SHOW VARIABLES LIKE 'server_id';
```

 

## **Шаг 2 - Запуск Docker контейнеров с нашими конфигурациями**

После того как мы сделали все нужные нам приготовления мы можем запустить контейнеры с серверами.

Запускаем первый контейнер:

```
docker run --name mysql1 -e MYSQL_ROOT_PASSWORD=mysql1pass -e MYSQL_DATABASE=mydata -dit -p 33061:3306 -v /opt2/mysql/server1/conf.d:/etc/mysql/mysql.conf.d/   -v /opt2/mysql/server1/data:/var/lib/mysql -v /opt2/mysql/server1/log:/var/log/mysql -v /opt2/mysql/server1/backup:/backup -h  mysql1 mysql

```

Запускаем второй контейнер:

```
docker run --name mysql2 --link mysql1 -e MYSQL_ROOT_PASSWORD=mysql2pass -e MYSQL_DATABASE=mydata -dit -p 33062:3306 -v /opt2/mysql/server2/conf.d:/etc/mysql/mysql.conf.d/   -v /opt2/mysql/server2/data:/var/lib/mysql -v /opt2/mysql/server2/log:/var/log/mysql -v /opt2/mysql/server2/backup:/backup -h  mysql2 mysql

```

После запуска каждой нужно немного подождать пока все сервисы внутри контейнера запустятся. Также, обратите внимание, что мы связали контейнер mysql2 с контейнером mysql1 во время запуска командой docker run.

## **Шаг 3 - Свяжем контейнер mysql1 с контейнером mysql2**

Решение скорее экспериментальное, так как, в момент запуска mysql1 у нас еще нет контейнера mysql2. Но в статьях на stackoverflow было найдено решение которое позволило связать mysql1 с mysql2 внутри интерфейса docker0. Главное, что докер просто создает запись хоста в связанном контейнере. Сделаем тоже самое только руками. Следует отметить что при перезапуске контейнеров их IP адреса могут меняться и вам придется пройти эту процедуру еще раз.

Итак. Мы возьмем IP контейнера mysql2 и потом сделаем запись в hosts файл в контейнере  mysql1.

```
# find out IP Address of mysql2

mysql2ip=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' mysql2)

#Append the new IP as new host entry in mysql1's host file.

docker exec -i mysql1 sh -c "echo '$mysql2ip mysql2 mysql2' >> /etc/hosts"

# Check if the above command worked

docker exec -i mysql1 sh -c "cat /etc/hosts"
```

Проверим соединение между двумя контейнерами:

```
docker exec -ti mysql2 sh -c "ping mysql1"
docker exec -ti mysql1 sh -c "ping mysql2"
```

Если все пингуется то можно переходить к следующему шагу.

## **Шаг 4 - Создание пользователя для репликации и проверка лога**

Mysql1 - нужно подключится и выполнить скрипт /backup/initdb.sql

```
/opt2/mysql$ docker exec -ti mysql1 sh -c "mysql -uroot -p"
Enter password:
mysql&gt; source /backup/initdb.sql
Database changed
Query OK, 0 rows affected (0.00 sec)
Query OK, 0 rows affected (0.00 sec)
Query OK, 0 rows affected (0.00 sec)
+------------------+----------+--------------+------------------+-------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000003 | 154 | mydata | | |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| server_id | 101 |
+---------------+-------+
1 row in set (0.01 sec)
```

 

Mysql2 - та же операция что и для mysql1

```
/opt2/mysql$ docker exec -ti mysql2 sh -c "mysql -uroot -p"
Enter password:
mysql&gt; source /backup/initdb.sql
Database changed
Query OK, 0 rows affected (0.00 sec)
Query OK, 0 rows affected (0.00 sec)
Query OK, 0 rows affected (0.00 sec)
+------------------+----------+--------------+------------------+-------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000003 | 154 | mydata | | |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| server_id | 102 |
+---------------+-------+
1 row in set (0.01 sec)
```

## **Шаг 5 - Установка источника репликации для контейнеров**

Mysql1:

```
/opt2/mysql$ docker exec -ti mysql2 sh -c "mysql -uroot -p"
Enter password:
mysql>> stop slave; 
mysql>> CHANGE MASTER TO MASTER_HOST = 'mysql1', MASTER_USER = 'replicator', 
   ->> MASTER_PASSWORD = 'repl1234or', MASTER_LOG_FILE = 'mysql-bin.000003', 
   ->> MASTER_LOG_POS = 154; 
mysql>> start slave;
mysql>> show slave status\g
```

Mysql2:

```
/opt2/mysql$ docker exec -ti mysql1 sh -c "mysql -uroot -p"
Enter password:
mysql>> stop slave; 
mysql>> CHANGE MASTER TO MASTER_HOST = 'mysql2', MASTER_USER = 'replicator', 
   ->> MASTER_PASSWORD = 'repl1234or', MASTER_LOG_FILE = 'mysql-bin.000003',
   ->> MASTER_LOG_POS = 154; 
mysql>> start slave;
mysql>> show slave status\g
```

 

## **Шаг 6 - Тестирование Master-Master репликации**

Для того чтобы протестировать репликацию просто создадим таблицу в контейнере mysql1 и посмотрим появиться ли таблица в контейнере mysql2, а затем удалим таблицу из mysql2 и посмотрим что бы она была удалена из mysql1.

Создадим таблицу:

```
use mydata;
create table students ('id' int,  'name' varchar(20));
```

Посмотрим появилась ли она в mysql2:

```
show tables in mydata;
```

Должны увидеть примерно следующее:

```
+-------------------+
| Tables_in_mydata |
+-------------------+
| students |
+-------------------+
1 row in set (0.00 sec)
```

Удалим таблицу в mysql2:

```
DROP TABLE students;
```

И посмотрим результат команды show tables в контейнере mysql1:

```
Empty set (0.00 sec)
```

Если все шаги пройдены и у вас нет таблиц то можно сказать что репликация Master - Master в mysql работает.

Источники:

- [https://github.com/besnik/tutorials/tree/master/docker-mysql](https://github.com/besnik/tutorials/tree/master/docker-mysql)
- [https://stackoverflow.com/questions/17157721/how-to-get-a-docker-containers-ip-address-from-the-host](https://stackoverflow.com/questions/17157721/how-to-get-a-docker-containers-ip-address-from-the-host)

**P.S**. Хотите больше статей по докеру или mysql? пишите в комментариях какие темы вас больше всего интересуют.

**P.S.S.** В планах написать статью о том как мы внедряли у себя на проекте Docker. (стек: микросервисы на Java, фронт на Symfony + Elasticsearch + Socket.io + ...)
