---
title: "PDO: Обработка ошибок"
date: 2014-12-25
categories: 
  - "pdo"
---

Когда все хорошо нам не нужно обрабатывать ошибки. Но, мы никогда не знаем что может произойти, поэтому мы используем обработчик ошибок. Рассмотрим пример кода.

<!--more-->

```
<?php
// configuration
$dbtype		= "sqlite";
$dbhost 	= "localhost";
$dbname		= "test";
$dbuser		= "root";
$dbpass		= "admin";

try{
  // database connection
  $conn = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass);
}
catch(PDOException $pe)
{
  die('Connection error, because: ' .$pe->getMessage());
}

// query
$sql = "SELECT title FROM books ORDER BY title";
$q	 = $conn->query($sql);

if(!$q)
{
  die("Execute query error, because: ". $conn->errorInfo());
}

$q->setFetchMode(PDO::FETCH_BOTH);

// fetch
while($r = $q->fetch()){
  print_r($r);
}

?>
```

Предыдущая:  [Выборка данных Fetch Mode](http://35.156.110.60/development/php/pdo/pdo-fetch-mode/ "PDO: Fetch mode примеры")

Следующая:


