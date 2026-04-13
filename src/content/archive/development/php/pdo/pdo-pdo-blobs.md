---
title: "PDO: Работа с BLOBs"
date: 2015-04-19
categories: 
  - "pdo"
tags: 
  - "blob"
  - "pdo-2"
---

Мы можем хранить изображения, музыку, видео или документы в базе данных (прим: MySql). Для работы с такими данными мы будем использовать поля таблиц с типом BLOB.

В СУБД тип данных [BLOB](https://dev.mysql.com/doc/refman/5.0/en/blob.html) (_Binary Large OBject_ — двоичный большой объект) - массив двоичных данных. В СУБД BLOB — специальный тип данных, предназначенный, в первую очередь, для хранения изображений, аудио и видео, а также компилированного программного кода.<!--more-->

Для начала, создадим таблицу с полем типа BLOB.

```
CREATE TABLE `books` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(150) NOT NULL,
  `author` varchar(150) NOT NULL,
  `description` varchar(255) NOT NULL,
  `on_sale` tinyint(1) NOT NULL,
  `cover` blob NOT NULL,
  PRIMARY KEY  (`id`)
);
```

Теперь же, рассмотрим пример как с помощью PDO вставить данные в таблицу:

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
$title = "ZEND FRAMEWORK TUTORIAL";
$author = "PHP Everyday";
$cover = fopen('7.png','rb');
// query
$sql = "INSERT INTO books (title,author,cover) values(?,?,?)";

$q = $conn->prepare($sql);
$q->bindParam(1, $title);
$q->bindParam(2, $author);
$q->bindParam(3, $cover, PDO::PARAM_LOB);

$q->execute();

?>
```

Хорошо, теперь "вытащим" эту запись:

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

// query
$sql = "SELECT id,title,author,cover FROM books";
$q = $conn->prepare($sql);
$q->execute();

$q->bindColumn(1, $id);
$q->bindColumn(2, $title);
$q->bindColumn(3, $author);
$q->bindColumn(4, $cover, PDO::PARAM_LOB);

while($q->fetch())
{
file_put_contents($id.".png",$cover);
echo "$title, $author, <img src='".$id.".png'> <br/>";
}

?>
```

Легко, не правда ли?


