---
title: "PDO: SELECT"
date: 2014-12-25
categories: 
  - "pdo"
tags: 
  - "pdo-2"
  - "pdo-select"
  - "php-2"
---

Сейчас проверим подлючение. Мы используем mysql сервер. Перед началом тестирования, мы создали базу данных "test". Потом создали таблицу "books".<!--more-->

```
CREATE TABLE `books` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(150) NOT NULL,
  `author` varchar(150) NOT NULL,
  `description` varchar(255) NOT NULL,
  `on_sale` tinyint(1) NOT NULL,
  PRIMARY KEY  (`id`)
);
```

 

```
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (1, 'PHP AJAX', 'Andreas', 'This is good book for learning AJAX', 1);
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (2, 'PHP Eclipse ', 'George', 'Nice book', 0);
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (3, 'PHP Prado', 'Junyian', '-', 1);
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (4, 'PHP Zend Framework', 'Ozulian', 'great', 0);
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (5, 'PHP Web Services', 'Bobi', '', 0);
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (6, 'PHP API', 'Hugo', '', 1);
INSERT INTO `books` (`id`, `title`, `author`, `description`, `on_sale`) VALUES (7, 'PHP SEO', 'Monteo', '', 1);
```

Пример использования PDO (PDO SELECT):

```
<?php
$host 	= "localhost";
$db	= "test";
$user	= "root";
$pass	= "admin";

$conn = new PDO("mysql:host=$host;dbname=$db",$user,$pass);

$sql = "SELECT * FROM books";
$q	 = $conn->query($sql) or die("failed!");
while($r = $q->fetch(PDO::FETCH_ASSOC)){
  echo $r['title'];
}

?>
```

Предидущая: [Активация PDO](http://35.156.110.60/development/php/pdo/activation/ "PDO: Активация PHP Data Objects Extension")

Следующая:


