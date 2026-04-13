---
title: "PDO: Обработка ошибок атрибутов соединения"
date: 2015-04-19
categories: 
  - "pdo"
---

Хотелось бы проговорить о PDO::ERRMODE. Этот атрибут управляет режимом отчетов об ошибках. Он имеет три значения: PDO :: ERRMODE\_SILENT, PDO :: ERRMODE\_WARNING и PDO: ERRMODE\_EXCEPTION. <!--more-->

PDO :: ERRMODE\_SILENT: когда есть ошибка, то никаких действий не предпринимается. Коды ошибок доступны через PDO :: ERRORCODE () и PDO :: errorInfo (). Это значение по умолчанию для PDO :: ATTR\_ERRMODE.

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
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
$sql = "SELECT * FROM booksa";
$q = $conn->query($sql) or die("ERROR: " . implode(":", $conn->errorInfo()));

$r = $q->fetch(PDO::FETCH_ASSOC);

print_r($r);

//result:
//ERROR: 42S02:1146:Table 'test.booksa' doesn't exist
?>
```

PDO :: ERRMODE\_WARNING: Никаких действий не предпринимается, но ошибка будет поднята с уровня E\_WARNING.

```
// query
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$sql = "SELECT * FROM booksa";
$q = $conn->query($sql) or die("ERROR: " . implode(":", $conn->errorInfo()));

$r = $q->fetch(PDO::FETCH_ASSOC);

print_r($r);

//result:
//Warning: PDO::query() [function.PDO-query]: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'test.booksa' doesn't exist in 
//C:\AppServ5\www\test\pdo\test.php on line 15
//ERROR: 42S02:1146:Table 'test.booksa' doesn't exist
```

PDO :: ERRMODE\_EXCEPTION: будет установлены коды ошибок (как PDO :: ERRMODE\_SILENT) и "выброшен" exception.

```
// query
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "SELECT * FROM booksa";
$q = $conn->query($sql) or die("ERROR: " . implode(":", $conn->errorInfo()));

$r = $q->fetch(PDO::FETCH_ASSOC);

print_r($r);

//result:
//Fatal error: Uncaught exception 'PDOException' with message 'SQLSTATE[42S02]: Base table or view not found: 1146 Table 'test.booksa' doesn't exist' in 
//C:\AppServ5\www\test\pdo\test.php:15 Stack trace: #0 C:\AppServ5\www\test\pdo\test.php(15): PDO->query('SELECT * FROM b...') #1 {main} thrown in 
//C:\AppServ5\www\test\pdo\test.php on line 15
```

 


