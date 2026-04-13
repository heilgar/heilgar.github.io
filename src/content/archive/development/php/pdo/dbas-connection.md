---
title: "PDO: подключение к разным СУБД"
date: 2014-12-25
categories: 
  - "pdo"
tags: 
  - "pdo-2"
  - "php-2"
  - "postgresql"
  - "sqlite"
---

Ранее мы писали что PDO это абстрактный класс для доступа к различным СУБД. В этой записи мы рассмотрим пример подключения к SQLite,  mysql, postgresql.<!--more-->

```
// for MySQL
$conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// for SQLite
$conn = new PDO("sqlite:$db");

// for postgreSQL
$conn = new PDO("pgsql:host=$host dbname=$db", $user, $pass);
```

PHP код:

```
<?php
// configuration
$dbtype		= "sqlite";
$dbhost 	= "localhost";
$dbname		= "test";
$dbuser		= "root";
$dbpass		= "admin";
$dbpath		= "c:/test.db";

// switching
switch($dbtype){
  case "mysql":
    $dbconn = "mysql:host=$dbhost;dbname=$dbname";
    break;
  
  case "sqlite":
    $dbconn = "sqlite:$dbpath";
	break;
  
  case "postgresql":
    $dbconn = "pgsql:host=$host dbname=$db";
	break;
}

// database connection
$conn = new PDO($dbconn,$user,$pass);

?>
```

Используя такой тип подключения, нам не важно какая БД используется. Нам всего лишь нужно изменить настройки подключения.

**Предыдущая: [PDO: MySQL SELECT](http://35.156.110.60/development/php/pdo/select/ "PDO: SELECT")**

**Следующая:**
