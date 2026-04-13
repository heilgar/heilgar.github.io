---
title: "PDO: Установка атрибутов соединения"
date: 2015-04-19
categories: 
  - "pdo"
---

В PDO существуют функции, которые называются атрибутами соединения. Этот функционал мы можем использовать что бы изменять имена столбцов, преобразовать регистр и так далее. Весь перечень ниже.<!--more-->

Пример использования:

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
$conn->setAttribute(PDO::ATTR_CASE, PDO::CASE_UPPER);
$sql = "SELECT * FROM books";
$q = $conn->prepare($sql);
$q->execute();

$r = $q->fetch(PDO::FETCH_ASSOC);

print_r($r);

//result:
//Array ( [ID] => 1 
//        [TITLE] => PHP AJAX 
//        [AUTHOR] => Andreas 
//        [DESCRIPTION] => This is good book for learning AJAX 
//        [ON_SALE] => 1 
//        [COVER] => )
?>
```

Хорошо, посмотрим строку 13:

```
$conn->setAttribute(PDO::ATTR_CASE, PDO::CASE_UPPER);
```

В коде используется атрибут PDO::ATTR\_CASE. Этот атрибут как указано выше управляет регистром имен столбцов возвращаемых в [PDOStatement::fetch()](http://php.net/manual/en/pdostatement.fetch.php). Это будет работать при условии что fetchMode установлен PDO :: FETCH\_ASSOC или PDO :: FETCH\_BOTH, потому что строка, возвращаемая в качестве массиву содержит столбцы индексируются по их имени. Из кода выше, получат результат:

```
Array ( [ID] => 1 
        [TITLE] => PHP AJAX 
        [AUTHOR] => Andreas 
        [DESCRIPTION] => This is good book for learning AJAX 
        [ON_SALE] => 1 
        [COVER] => )
```

Экспериментируйте и смотрите что будет получатся!

Перечень атрибутов:

- _PDO::ATTR\_CASE_: Изменить регистр имен.
    
    - _PDO::CASE\_LOWER_: Имена таблиц в нижнем регистре.
        
    - _PDO::CASE\_NATURAL_: Регистр имен возвращает СУБД.
        
    - _PDO::CASE\_UPPER_: Имена таблиц в верхнем регистре.
        

- [_PDO::ATTR\_ERRMODE_: Отчеты о ошибках.](http://35.156.110.60/development/php/pdo/pdo-error-mode-attrs/ "PDO: Обработка ошибок атрибутов соединения")
    
    - _PDO::ERRMODE\_SILENT_: Вернет только код ошибки.
        
    - _PDO::ERRMODE\_WARNING_: Вернет [E\_WARNING](http://php.net/manual/en/pdo.setattribute.php).
        
    - _PDO::ERRMODE\_EXCEPTION_: Throw [exceptions](http://php.net/manual/en/class.pdoexception.php).
        

- _PDO::ATTR\_ORACLE\_NULLS_ (допустимо для всех драйверов СУБД, а не только Oracle): Преобразование строк содержащих NULL и ничего не содержащих.
    
    - _PDO::NULL\_NATURAL_: Без преобразования.
        
    - _PDO::NULL\_EMPTY\_STRING_: Все пустые строки конвертируются в NULL.
        
    - _PDO::NULL\_TO\_STRING_: NULL конвертируется в пустые строки.
        

- _PDO::ATTR\_STRINGIFY\_FETCHES_: При выборке конвертирует цифровые типы в строковые. Требует bool.
    
- _PDO::ATTR\_STATEMENT\_CLASS_: Установит пользовательский класс наследующий PDOStatement. Не может использоваться постоянно. Требуется _array(string classname, array(mixed constructor\_args))_.
    
- _PDO::ATTR\_TIMEOUT_: Задает длительность ожидания в секундах. Не все драйверы поддерживают эту опцию, и его значение может отличаться от драйвера к драйверу. Например, SQLite будет ждать до этого значения, прежде чем давать на получение блокировки записи, но и другие водители могут интерпретировать это как соединения или интервала тайм-аута для чтения. Требует [int](http://php.net/manual/en/language.types.integer.php).
    
- _PDO::ATTR\_AUTOCOMMIT_ (OCI, Firebird и MySQL): Автоматически выполняет единичные запросы.
    
- _PDO::ATTR\_EMULATE\_PREPARES_ Включает или отключает эмуляцию подготовленных заявлений. Некоторые драйверы не поддерживают родные подготовленные заявления или имеет ограниченную поддержку для них. Используйте этот параметр, чтобы заставить PDO либо всегда подражать подготовленные заявления (если это TRUE), или попробовать использовать родной подготовленные заявления (если FALSE). Он всегда будет вернуться к эмуляции подготовленное заявление, если водитель не может успешно подготовиться текущий запрос. Требует [bool](http://php.net/manual/en/language.types.boolean.php).
    
- _PDO::MYSQL\_ATTR\_USE\_BUFFERED\_QUERY_ (только MySQL): Использует буфер запросов.
    
- _PDO::ATTR\_DEFAULT\_FETCH\_MODE_: Установить по умолчанию режим извлечения. Описание режимов доступно по ссылке [PDOStatement::fetch()](http://php.net/manual/en/pdostatement.fetch.php) или в записи [Режимы извлечения](http://35.156.110.60/development/php/pdo/pdo-fetch-mode/).
    


