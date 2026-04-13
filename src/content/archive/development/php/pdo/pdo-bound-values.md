---
title: "PDO: Хранимые процедуры и связанные значения"
date: 2015-04-19
categories: 
  - "pdo"
tags: 
  - "pdo-2"
  - "pdo-insert"
  - "pdo-select"
---

PDO также поддерживает запросы к разным таблицам и полям таблиц. В этих запросах вы можете явно связать значение или переменную в имени или указать значение вместо метки. Пример:

<!--more-->

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

// query
$sql = "SELECT * FROM books";
$q = $conn->prepare($sql);
$q->execute();

$q->bindColumn(1, $id);
$q->bindColumn(2, $title);
$q->bindColumn(3, $author);

while($q->fetch())
{
echo "$title, $author <br/>";
}

?>
```

Пример для Insert:

```
// query
$sql = "INSERT INTO books (title,author) values(?,?)";

$q = $conn->prepare($sql);
$q->bindColumn(1, $title);
$q->bindColumn(2, $title);

$q->execute();
```

 


