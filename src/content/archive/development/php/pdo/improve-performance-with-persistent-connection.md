---
title: "PDO: Повышение производительности и постоянное соединение"
date: 2015-04-19
categories: 
  - "pdo"
tags: 
  - "pdo-2"
  - "optimizatsiya"
---

 Постоянные соединения известны как способ повышения производительности. Когда постоянное соединение запрашивается, PHP проверяет, есть ли уже идентичное постоянное соединение с ранее оставался открытым. <!--more-->Если он существует, то он использует его. Какой смысл в остается открытым? Постоянное соединение являются ссылки, которые не закрываются при исполнении вашего скрипта."Идентичным" подразумевается соединение, открытое на тот же хост с таким же именем пользователя и паролем. Как использовать его в PDO? PDO имеют PDO :: ATTR\_PERSISTENT. Мы устанавливаем в конструкторе PDO:



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

// query
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "SELECT * FROM books";
$q = $conn->query($sql) or die("ERROR: " . implode(":", $conn->errorInfo()));

$r = $q->fetch(PDO::FETCH_ASSOC);

print_r($r);

?>
```
