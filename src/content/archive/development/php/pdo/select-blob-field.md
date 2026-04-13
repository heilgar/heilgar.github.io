---
title: "PDO: Альтернативы выборки из BLOB"
date: 2015-04-19
categories: 
  - "pdo"
tags: 
  - "blob"
  - "pdo-2"
---

[В предыдущей статье](http://35.156.110.60/development/php/pdo/pdo-pdo-blobs/) мы говорили о работе с полями типа BLOB. Мы практиковали как вставлять и извлекать данные. Теперь, мы поговорим о альтернативном варианте извлечения данных.<!--more-->

В прошлой записи мы рассматривали следующий код:

```
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

```

В строке 13 мы создаем файл. Содержание этого файла типа BLOB. Затем мы вызываем этот файл в строке 14. Таким образом, мы всегда можем создать файл «физически».

Альтернативным же способом является вызов «виртуального» файла на лету. Создайте файл с именем «cover.php»:

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
$sql = "SELECT cover FROM books WHERE id=".$_GET['id'];
$q = $conn->prepare($sql);
$q->execute();

$q->bindColumn(1, $cover, PDO::PARAM_LOB);
$q->fetch(PDO::FETCH_BOUND);
header("Content-Type: image/png");
echo $cover;
?>
```

Эта страница показывает только изображение. Теперь мы обновляем извлечение данных:

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
echo "$title, $author, <img src='cover.php?id=".$id."'> <br/>";
}

?>
```

 


