---
title: "PDO: Fetch mode примеры"
date: 2014-12-25
categories: 
  - "pdo"
tags: 
  - "fetch"
  - "pdo-2"
---

В этой записи мы рассмотрим возможные методы извлечения данных из БД. В mysql, как мы знаем есть mysql\_fetch\_row(), mysql\_fetch\_array(), mysql\_fetch\_assoc().

Посмотрим как єто реализуется в PDO.

<!--more-->

## PDOStatement::fetch

```
public mixed PDOStatement::fetch ([ int $fetch_style [, int $cursor_orientation = PDO::FETCH_ORI_NEXT [, int $cursor_offset = 0 ]]] )
```

Выбирает строку из результирующего набора, связанного с объектом PDOStatement.Fetch\_style параметр определяет, как PDO возвращает строку.

### Параметры

fetch\_style - Управляет тем, как следующая строка будет возвращена в вызывающую программу. Это значение должно быть одним из PDO :: FETCH\_ \* констант, по умолчанию значение PDO :: ATTR\_DEFAULT\_FETCH\_MODE (который по умолчанию PDO :: FETCH\_BOTH).

- _PDO::FETCH\_ASSOC_: возвращает массив, индексированный по колонке именем вернулся в результирующий набор
    
- _PDO::FETCH\_BOTH_ (default): возвращает массив, индексированный по обе имя столбца и 0-индексированные номер столбца, как вернулся в результирующий набор
    
- _PDO::FETCH\_BOUND_: возвращает TRUE, и присваивает значения столбцов в наборе результатов на PHP переменных, к которым они были связаны с методом [PDOStatement::bindColumn()](http://php.net/manual/en/pdostatement.bindcolumn.php)
    
- _PDO::FETCH\_CLASS_: возвращает новый экземпляр запрашиваемого класса, отображение столбцов результирующего набора для именованных свойств в классе. Если fetch\_style включает PDO :: FETCH\_CLASSTYPE (например, PDO :: FETCH\_CLASS | PDO :: FETCH\_CLASSTYPE), то имя класса определяется из значения первого столбца.
    
- _PDO::FETCH\_INTO_: обновляет существующий экземпляр запрашиваемого класса, отображение столбцов результирующего набора для именованных свойств в классе
    
- _PDO::FETCH\_LAZY_: сочетает в себе PDO :: FETCH\_BOTH и PDO :: FETCH\_OBJ, создавая имена объектов переменных, зависит от того как к ним обращались
    
- _PDO::FETCH\_NAMED_: возвращает массив в той же форме что и PDO :: FETCH\_ASSOC, кроме того, что, если существует несколько столбцов с одинаковым именем, значение, указанное в этом ключе будет массив всех значений в строке, которые имели  имя столбца
    
- _PDO::FETCH\_NUM_: возвращает массив, индексированный по номеру столбца, как вернулся в результирующий набор, начиная со столбца 0
    
- _PDO::FETCH\_OBJ_: возвращает анонимный объект с именами свойств, которые соответствуют именам столбцов, возвращаемых в результирующем наборе
    

 

Простой код:

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
$sql = "SELECT title FROM books ORDER BY title";
$q	 = $conn->query($sql);

// fetch
while($r = $q->fetch()){
  print_r($r);
}

// result
//Array ( [title] => PHP AJAX [0] => PHP AJAX ) 
//Array ( [title] => PHP API [0] => PHP API ) 
//Array ( [title] => PHP Eclipse [0] => PHP Eclipse ) 
//Array ( [title] => PHP Prado [0] => PHP Prado ) 
//Array ( [title] => PHP SEO [0] => PHP SEO ) 
//Array ( [title] => PHP Web Services [0] => PHP Web Services ) 
//Array ( [title] => PHP Zend Framework [0] => PHP Zend Framework )
?>
```

Fech Association:

```
// query
$sql = "SELECT title FROM books ORDER BY title";
$q	 = $conn->query($sql);
$q->setFetchMode(PDO::FETCH_ASSOC);

// fetch
while($r = $q->fetch()){
  print_r($r);
}

// result
//Array ( [title] => PHP AJAX) 
//Array ( [title] => PHP API) 
//Array ( [title] => PHP Eclipse) 
//Array ( [title] => PHP Prado) 
//Array ( [title] => PHP SEO) 
//Array ( [title] => PHP Web Services) 
//Array ( [title] => PHP Zend Framework)
```

**Fetch Num** (как mysql\_fetch\_row()):

```
$q->setFetchMode(PDO::FETCH_NUM);

// fetch
while($r = $q->fetch()){
  print_r($r);
}

// result
//Array ( [0] => PHP AJAX ) 
//Array ( [0] => PHP API ) 
//Array ( [0] => PHP Eclipse ) 
//Array ( [0] => PHP Prado ) 
//Array ( [0] => PHP SEO ) 
//Array ( [0] => PHP Web Services ) 
//Array ( [0] => PHP Zend Framework )
```

**Fetch Both (стандарт):**

```
$q->setFetchMode(PDO::FETCH_BOTH);
$q	 = $conn->query($sql);

// fetch
while($r = $q->fetch()){
  print_r($r);
}

// result
//Array ( [title] => PHP AJAX [0] => PHP AJAX ) 
//Array ( [title] => PHP API [0] => PHP API ) 
//Array ( [title] => PHP Eclipse [0] => PHP Eclipse ) 
//Array ( [title] => PHP Prado [0] => PHP Prado ) 
//Array ( [title] => PHP SEO [0] => PHP SEO ) 
//Array ( [title] => PHP Web Services [0] => PHP Web Services ) 
//Array ( [title] => PHP Zend Framework [0] => PHP Zend Framework )
?>

```


