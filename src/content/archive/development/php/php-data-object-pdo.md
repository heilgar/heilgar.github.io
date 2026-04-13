---
title: "PHP Data Object /PDO Гайд в примерах"
date: 2014-12-24
categories: 
  - "php"
  - "pdo"
tags: 
  - "database"
  - "pdo-2"
  - "php-2"
---

PHP Object Data / PDO  Учебник PHP Шаг за шагом. Библиотека для соединения PHP5 c базой данных.

## Что такое PDO?

- Библиотека для PHP5 написанная на (С/С++).
- Легкий абстрактный класс для соединения с СУБД (абстракция для доступа).

Почему PDO?

- Поддержка большого количества систем управления баз данных. Вам не придется переписывать код для каждой базы данных. Достаточно написать один код для разных СУБД. 
    
     
- PDO работает намного быстрее чем (mysql\_connect.. и т.д.), а также библиотек (ADOdb, PEAR DB).
- Библиотека по умолчанию включена в PHP5 и поэтому не нужно подключать сторонние библиотеки.

### Когда вам нужно PDO?

- Вам нужны портативные приложения, которые поддерживают различные СУБД
- Вам нужна скорость

### Как использовать PDO?

- [Введение в PHP Data Object](http://thewebland.net/development/php/pdo/pdo-intro/ "PDO: Введение в PHP Data Object")
- [Активация PHP Data Objects Extension](http://thewebland.net/development/php/pdo/activation/ "PDO: Активация PHP Data Objects Extension")
- [PHP vs Mysql PDO Select](http://thewebland.net/development/php/pdo/select/ "PDO: SELECT")
- [PDO подключение к разным СУБД](http://thewebland.net/development/php/pdo/dbas-connection/ "PDO: подключение к разным СУБД")
- [Режимы извлечения Fetch Mode](http://thewebland.net/development/php/pdo/pdo-fetch-mode/ "PDO: Fetch mode примеры")
- [Обработка ошибок](http://thewebland.net/development/php/pdo/pdo-error-handling/ "PDO: Обработка ошибок")
- [Хранимые процедуры](http://thewebland.net/development/php/pdo-prepared-statement/ "PDO: Хранимые процедуры")
- [Позиционные и именованные метки](http://thewebland.net/development/php/pdo/pdo-playsholders/ "PDO: Позиционные и именные плейсхолдеры")
- [Insert и Update используя хранимые процедуры](http://thewebland.net/development/php/pdo-insert-update/ "PDO: Insert и Update используя хранимые процедуры")
- [Хранимые процедуры и связанные значения](http://thewebland.net/news/pdo-bound-values/ "PDO: Хранимые процедуры и связанные значения")
- [Работа с BLOBs](http://thewebland.net/development/php/pdo/pdo-pdo-blobs/ "PDO: Работа с BLOBs")
- [Альтернативы выборки из BLOB](http://thewebland.net/development/php/pdo/select-blob-field/ "PDO: Альтернативы выборки из BLOB")
- [Установка атрибутов соединения](http://thewebland.net/development/php/pdo/pdo-connection-settings/ "PDO: Установка атрибутов соединения")
- [Обработка ошибок атрибутов соединения](http://thewebland.net/development/php/pdo/pdo-error-mode-attrs/ "PDO: Обработка ошибок атрибутов соединения")
- [Повышение производительности и постоянное соединение](http://thewebland.net/development/php/pdo/improve-performance-with-persistent-connection/ "PDO: Повышение производительности и постоянное соединение")
- [Получение атрибутов соединения](http://thewebland.net/development/php/pdo/getting-connection-attributes/ "PDO: Получение атрибутов соединения")
