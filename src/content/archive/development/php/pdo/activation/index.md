---
title: "PDO: Активация PHP Data Objects Extension"
date: 2014-12-25
categories: 
  - "pdo"
tags: 
  - "database"
  - "pdo-2"
  - "php-2"
---

Сейчас, мы активируем расширение PDO.

Для начала проверьте есть ли у вас библиотека или нет. Откройте папку с php5. Для примера app/php5/ext.

![pdo\_01\_01](./images/pdo_01_01.jpg)

Далее откройте файл php.ini. Раскомментируйте строки extension=php\_pdo.dll, extension=php\_pdo\_mysql.dll.

[![pdo\_01\_02](./images/pdo_01_02.jpg)


](http://18.185.47.240/wp-content/uploads/2014/12/pdo_01_02.jpg)

Перезапустите сервис apache. Для windows > Пуск > Панель управления > Обслуживание > Administarive tools > Сервисы

[![pdo\_01\_03](./images/pdo_01_03.jpg)](http://18.185.47.240/wp-content/uploads/2014/12/pdo_01_03.jpg)

**Предыдуший: [Введение в PDO](http://35.156.110.60/development/php/pdo/pdo-intro/ "PDO: Введение в PHP Data Object")**

**Следующий:**
