---
title: "PDO: Insert и Update используя хранимые процедуры"
date: 2015-04-19
categories: 
  - "php"
  - "pdo"
---

Продолжая наш цикл примеров по PHP PDO, хотелось бы обратить ваше внимание на весьма распространенные функции как Insert и Update c использованием хранимых процедур PHP PDO.<!--more-->

Пример использования PDO Insert

```
<?php
// configuration
$dbtype		= "sqlite";
$dbhost 	= "localhost";
$dbname		= "test";
$dbuser		= "root";
$dbpass		= "admin";

// database connection
$conn = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass);

// new data
$title = 'PHP Security';
$author = 'Jack Hijack';

// query
$sql = "INSERT INTO books (title,author) VALUES (:title,:author)";
$q = $conn->prepare($sql);
$q->execute(array(':author'=>$author,
                  ':title'=>$title));

?>
```

Пример использования PDO Update

```
<?php
// configuration
$dbtype		= "sqlite";
$dbhost 	= "localhost";
$dbname		= "test";
$dbuser		= "root";
$dbpass		= "admin";

// database connection
$conn = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass);

// new data
$title = 'PHP Pattern';
$author = 'Imanda';
$id = 3;
// query
$sql = "UPDATE books 
        SET title=?, author=?
		WHERE id=?";
$q = $conn->prepare($sql);
$q->execute(array($title,$author,$id));

?>
```

 


