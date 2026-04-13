---
title: "PDO: Получение атрибутов соединения"
date: 2015-04-19
categories: 
  - "pdo"
tags: 
  - "pdo-2"
---

Несколько постов назад мы говорили о установке атрибутов соединения. Теперь, мы поговорим о том, как получить значение из атрибутов соединения.<!--more--> Мы можем использовать GetAttribute (). Посмотрите этот пример:

PDO: ATTR\_DRIVER\_NAME: возвращает имя основного драйвера базы данных.

```
<?php
// configuration
$dbtype		= "sqlite";
$dbhost 	= "localhost";
$dbname		= "test";
$dbuser		= "root";
$dbpass		= "admin";

// database connection
$conn = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass, array(PDO::ATTR_PERSISTENT => true));

echo $conn->getAttribute(PDO::ATTR_DRIVER_NAME);
// result: mysql
?>
```

 

Еще пример:

```
<?php
// configuration
$dbtype		= "sqlite";
$dbhost 	= "localhost";
$dbname		= "test";
$dbuser		= "root";
$dbpass		= "admin";

// database connection
$conn = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass, array(PDO::ATTR_PERSISTENT => true));

echo $conn->getAttribute(PDO::ATTR_DRIVER_NAME);
echo "<br>";
echo $conn->getAttribute(PDO::ATTR_CLIENT_VERSION);
echo "<br>";
echo $conn->getAttribute(PDO::ATTR_SERVER_VERSION);

?>
```

Подробно о всех атрибутах на php.net


