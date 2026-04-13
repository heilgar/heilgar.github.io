---
title: "PDO: Хранимые процедуры"
date: 2015-01-27
categories: 
  - "php"
  - "pdo"
---

Пример использования prepared statement с помощью PHP PDO.<!--more-->

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

$title = 'PHP AJAX';

// query
$sql = "SELECT * FROM books WHERE title = ?";
$q = $conn->prepare($sql);
$q->execute(array($title));

$q->setFetchMode(PDO::FETCH_BOTH);

// fetch
while($r = $q->fetch()){
  print_r($r);
}

?>
```

в этом простом примере, запрос зависит от переменной ( ?). В следующих постах выложу примеры своих исходников.

```
$sql = "SELECT * FROM books WHERE title = ?";
```

Теперь мы можем манипулировать запросом. Так как все зависит от переменной которую можно подставить.

```
$q = $conn->prepare($sql);
$q->execute(array($title))
```

еще пример:

```
$title = 'PHP%';
$author = 'Bobi%';
// query
$sql = "SELECT * FROM books WHERE title like ? AND author like ? ";
$q = $conn->prepare($sql);
$q->execute(array($title,$author));
```

 


