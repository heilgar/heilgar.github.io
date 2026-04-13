---
title: "Пишем тесты с помощью PHPUnit"
date: 2018-09-18
categories: 
  - "phpunit"
---

В примере 2.1 показано, как мы можем писать тесты с использованием PHPUnit, которые выполняют операции массива PHP. В этом примере представлены основные соглашения и шаги для написания тестов с помощью PHPUnit:

1. Тесты для класса Class переходят в класс с названием ClassTest.
2. ClassTest наследует (большую часть времени) PHPUnit\\Framework\\TestCase.
3. Тесты - это общедоступные методы, которые называются test\*.
4. Кроме того, вы можете использовать аннотацию @test в docblock метода, чтобы пометить ее как метод тестирования.
5. Внутри методов тестирования, методы утверждения, такие как assertSame(), используются, чтобы утверждать, что фактическое значение соответствует ожидаемому значению.

Пример 2.1 Тестирование операций массива с помощью PHPUnit

<!--more-->

```
<?php
use PHPUnit\Framework\TestCase;

class StackTest extends TestCase
{
   public function testPushAndPop()
   {
       $stack = [];
       $this->assertSame(0, count($stack));

       array_push($stack, 'foo');
       $this->assertSame('foo', $stack[count($stack)-1]);
       $this->assertSame(1, count($stack));

       $this->assertSame('foo', array_pop($stack));
       $this->assertSame(0, count($stack));
   }
}
```

>  
> 
> _Martin Fowler_:
> 
> _Всякий раз, когда возникает соблазн ввести что-то в оператор_ _print_ _или выражение отладчика, вместо этого напишите его как тест._

 

## Зависимости тестов

> _Adrian Kuhn et. al._:
> 
> _Юнит тесты в первую очередь написаны как best practice, помогающая разработчикам выявлять и исправлять ошибки, рефакторинга и служить документацией для тестируемого модуля. Для достижения этих преимуществ юнит-тесты в идеале должны охватывать все возможные пути в программе. Один тест обычно охватывает один конкретный путь в одной функции или методе. Однако метод тестирования не обязательно является инкапсулированным независимым объектом. Часто существуют неявные зависимости между методами тестирования, скрытые в сценарии реализации теста._

 

PHPUnit поддерживает декларацию явных зависимостей между методами тестирования. Такие зависимости не определяют порядок, в котором должны выполняться тестовые методы, но они позволяют возвращать экземпляр тестового набора (producer) и передавать его зависимым потребителям (consumer).

- Producer (производитель) - это метод тестирования, который возвращает результат тестирования качестве возвращаемого значения.
- Consumer (потребитель) - это метод тестирования, который зависит от одного или нескольких Producer и их возвращаемых значений.

В примере 2.2 показано, как использовать аннотацию @depends для выражения зависимостей между методами тестирования.

Пример 2.2. Использование аннотации @depends для выражения зависимостей

```
<?php
use PHPUnit\Framework\TestCase;

class StackTest extends TestCase
{
   public function testEmpty()
   {
       $stack = [];
       $this->assertEmpty($stack);

       return $stack;
   }

   /**
    * @depends testEmpty
    */
   public function testPush(array $stack)
   {
       array_push($stack, 'foo');
       $this->assertSame('foo', $stack[count($stack)-1]);
       $this->assertNotEmpty($stack);

       return $stack;
   }

   /**
    * @depends testPush
    */
   public function testPop(array $stack)
   {
       $this->assertSame('foo', array_pop($stack));
       $this->assertEmpty($stack);
   }
}
```

В приведенном выше примере первый тест testEmpty() создает новый массив и утверждает, что он пуст. Затем тест возвращает фикстуру в качестве результата. Второй тест testPush() зависит от testEmpty() и передается результат этого зависимого теста в качестве аргумента. Наконец, testPop() зависит от testPush().

 

> **_Note:_**
> 
> _Возвращаемое значение, полученное producer, по умолчанию передается потребителям «как есть». Это означает, что когда производитель возвращает объект, ссылка на этот объект передается потребителям. Вместо ссылки: (a) (глубокая) копия через_ _@depends_ _clone_ _или (b) возможен также (нормальный) клон (на основе ключевого слова PHP clone) через_ _@depends_ _shallowClone__._

 

Чтобы быстро локализовать дефекты, мы хотим, чтобы наше внимание было сосредоточено на соответствующих тестах. Вот почему PHPUnit пропускает выполнение зависящего теста, когда зависимый тест не сработал. Это улучшает локализацию дефектов, используя зависимости между тестами, как показано в примере 2.3.

Пример 2.3 Использование зависимостей между тестами

```
<?php
use PHPUnit\Framework\TestCase;

class DependencyFailureTest extends TestCase
{
   public function testOne()
   {
       $this->assertTrue(false);
   }

   /**
    * @depends testOne
    */
   public function testTwo()
   {
   }
}

```

```
$ phpunit --verbose DependencyFailureTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

FS

Time: 0 seconds, Memory: 5.00Mb

There was 1 failure:

1) DependencyFailureTest::testOne
Failed asserting that false is true.

/home/sb/DependencyFailureTest.php:6

There was 1 skipped test:

1) DependencyFailureTest::testTwo
This test depends on "DependencyFailureTest::testOne" to pass.

FAILURES!
Tests: 1, Assertions: 1, Failures: 1, Skipped: 1.
```

Тест может содержать более одной аннотации @depends. PHPUnit не изменяет порядок выполнения тестов, вы должны убедиться, что зависимости теста действительно могут быть выполнены до запуска теста.

Тест, который содержит более одной аннотации @depends, получит первый экземпляр первого producer в качестве первого аргумента, второй от второго producer и т.д. См. Пример 2.4.

Пример 2.4. Тестирование с несколькими зависимостями

```
<?php
use PHPUnit\Framework\TestCase;

class MultipleDependenciesTest extends TestCase
{
   public function testProducerFirst()
   {
       $this->assertTrue(true);
       return 'first';
   }

   public function testProducerSecond()
   {
       $this->assertTrue(true);
       return 'second';
   }

   /**
    * @depends testProducerFirst
    * @depends testProducerSecond
    */
   public function testConsumer($a, $b)
   {
       $this->assertSame('first', $a);
       $this->assertSame('second', $b);
   }
}
```

```
$ phpunit --verbose MultipleDependenciesTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

...

Time: 0 seconds, Memory: 3.25Mb

OK (3 tests, 3 assertions)

```

 

## **Поставщики данных**

Метод тестирования может принимать произвольные аргументы. Эти аргументы должны быть предоставлены одним или несколькими методами передачи данных (additionProvider() в примере 2.5). Используемый метод поставщика данных задается с помощью аннотации @dataProvider.

 

Метод поставщика данных должен быть public и либо возвращать массив массивов, либо объект, реализующий интерфейс Iterator, и выводит массив для каждого шага итерации. Для каждого массива, который является частью коллекции, в качестве аргументов будет вызываться тестовый метод с содержимым массива.

 

Пример 2.5. Использование поставщика данных, который возвращает массив массивов

```
<?php
use PHPUnit\Framework\TestCase;

class DataTest extends TestCase
{
   /**
    * @dataProvider additionProvider
    */
   public function testAdd($a, $b, $expected)
   {
       $this->assertSame($expected, $a + $b);
   }

   public function additionProvider()
   {
       return [
           [0, 0, 0],
           [0, 1, 1],
           [1, 0, 1],
           [1, 1, 3]
       ];
   }
}

```

```
$ phpunit DataTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

...F

Time: 0 seconds, Memory: 5.75Mb

There was 1 failure:

1) DataTest::testAdd with data set #3 (1, 1, 3)
Failed asserting that 2 is identical to 3.

/home/sb/DataTest.php:9

FAILURES!
Tests: 4, Assertions: 4, Failures: 1.

```

При использовании большого количества наборов данных полезно называть каждый из них строковым ключом, а не по умолчанию. Результат будет более подробным, так как он будет содержать имя набора данных, который нарушает тест.

Пример 2.6. Использование поставщика данных с именованными наборами данных

```
<?php
use PHPUnit\Framework\TestCase;

class DataTest extends TestCase
{
   /**
    * @dataProvider additionProvider
    */
   public function testAdd($a, $b, $expected)
   {
       $this->assertSame($expected, $a + $b);
   }

   public function additionProvider()
   {
       return [
           'adding zeros'  => [0, 0, 0],
           'zero plus one' => [0, 1, 1],
           'one plus zero' => [1, 0, 1],
           'one plus one'  => [1, 1, 3]
       ];
   }
}
```

```
$ phpunit DataTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

...F

Time: 0 seconds, Memory: 5.75Mb

There was 1 failure:

1) DataTest::testAdd with data set "one plus one" (1, 1, 3)
Failed asserting that 2 is identical to 3.

/home/sb/DataTest.php:9

FAILURES!
Tests: 4, Assertions: 4, Failures: 1.
```

Пример 2.7. Использование поставщика данных, который возвращает объект Iterator

```
<?php
use PHPUnit\Framework\TestCase;

require 'CsvFileIterator.php';

class DataTest extends TestCase
{
   /**
    * @dataProvider additionProvider
    */
   public function testAdd($a, $b, $expected)
   {
       $this->assertSame($expected, $a + $b);
   }

   public function additionProvider()
   {
       return new CsvFileIterator('data.csv');
   }
}
```

```
$ phpunit DataTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

...F

Time: 0 seconds, Memory: 5.75Mb

There was 1 failure:

1) DataTest::testAdd with data set #3 ('1', '1', '3')
Failed asserting that 2 is identical to 3.

/home/sb/DataTest.php:11

FAILURES!
Tests: 4, Assertions: 4, Failures: 1.
```

Пример 2.8 Класс CsvFileIterator

```
<?php
use PHPUnit\Framework\TestCase;

class CsvFileIterator implements Iterator
{
   protected $file;
   protected $key = 0;
   protected $current;

   public function __construct($file)
   {
       $this->file = fopen($file, 'r');
   }

   public function __destruct()
   {
       fclose($this->file);
   }

   public function rewind()
   {
       rewind($this->file);
       $this->current = fgetcsv($this->file);
       $this->key = 0;
   }

   public function valid()
   {
       return !feof($this->file);
   }

   public function key()
   {
       return $this->key;
   }

   public function current()
   {
       return $this->current;
   }

   public function next()
   {
       $this->current = fgetcsv($this->file);
       $this->key++;
   }
}
```

Когда тест получает входные данные как из метода @dataProvider, так и из одного или нескольких тестов на которые он @depends, аргументы от поставщика данных будут поступать  для зависимых тестов. Аргументы из зависимых тестов будут одинаковыми для каждого набора данных. См. Пример 2.9

Пример 2.9 Комбинация @depends и @dataProvider в одном тесте

```
<?php
use PHPUnit\Framework\TestCase;

class DependencyAndDataProviderComboTest extends TestCase
{
   public function provider()
   {
       return [['provider1'], ['provider2']];
   }

   public function testProducerFirst()
   {
       $this->assertTrue(true);
       return 'first';
   }

   public function testProducerSecond()
   {
       $this->assertTrue(true);
       return 'second';
   }

   /**
    * @depends testProducerFirst
    * @depends testProducerSecond
    * @dataProvider provider
    */
   public function testConsumer()
   {
       $this->assertSame(
           ['provider1', 'first', 'second'],
           func_get_args()
       );
   }
}
```

 

```
$ phpunit --verbose DependencyAndDataProviderComboTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

...F

Time: 0 seconds, Memory: 3.50Mb

There was 1 failure:

1) DependencyAndDataProviderComboTest::testConsumer with data set #1 ('provider2')
Failed asserting that two arrays are identical.
--- Expected
+++ Actual
@@ @@
Array &0 (
-    0 => 'provider1'
+    0 => 'provider2'
    1 => 'first'
    2 => 'second'
)
/home/sb/DependencyAndDataProviderComboTest.php:32

FAILURES!
Tests: 4, Assertions: 4, Failures: 1.
```

Пример 2.10. Использование нескольких поставщиков данных для одного теста

```
<?php
use PHPUnit\Framework\TestCase;

class DataTest extends TestCase
{
   /**
    * @dataProvider additionWithNonNegativeNumbersProvider
    * @dataProvider additionWithNegativeNumbersProvider
    */
   public function testAdd($a, $b, $expected)
   {
       $this->assertSame($expected, $a + $b);
   }

   public function additionWithNonNegativeNumbersProvider()
   {
       return [
           [0, 1, 1],
           [1, 0, 1],
           [1, 1, 3]
       ];
   }

   public function additionWithNegativeNumbersProvider()
   {
       return [
           [-1, 1, 0],
           [-1, -1, -2],
           [1, -1, 0]
       ];
   }
}
```

```
$ phpunit DataTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

..F...                                                              6 / 6 (100%)

Time: 0 seconds, Memory: 5.75Mb

There was 1 failure:

1) DataTest::testAdd with data set #3 (1, 1, 3)
Failed asserting that 2 is identical to 3.

/home/sb/DataTest.php:12

FAILURES!
Tests: 6, Assertions: 6, Failures: 1.
```

> **Note:**
> 
> Когда тест зависит от теста, который использует поставщиков данных, зависящий тест будет выполняться, когда тест, от которого он зависит, успешно отработает как минимум для одного набора данных. Результат теста, который использует поставщиков данных, не может быть введен в зависимый тест.

 

```
Note:

Все поставщики данных выполняются перед вызовом статического метода setUpBeforeClass() и первого вызова метода setUp(). Из-за этого вы не можете получить доступ к любым переменным, которые вы создаете там, из поставщика данных. Это необходимо для того, чтобы PHPUnit мог вычислить общее количество тестов.
```

 

## Тестирование исключений

В примере 2.11 показано, как использовать метод expectException() для проверки того, выбрано ли исключение для проверяемого кода.

Пример 2.11 Использование метода expectException()

```
<?php
use PHPUnit\Framework\TestCase;

class ExceptionTest extends TestCase
{
   public function testException()
   {
       $this->expectException(InvalidArgumentException::class);
   }
}
```

```
$ phpunit ExceptionTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

F

Time: 0 seconds, Memory: 4.75Mb

There was 1 failure:

1) ExceptionTest::testException
Failed asserting that exception of type "InvalidArgumentException" is thrown.

FAILURES!
Tests: 1, Assertions: 1, Failures: 1.

```

В дополнение к методу expectException() существуют методы expectExceptionCode(), expectExceptionMessage() и expectExceptionMessageRegExp(), чтобы установить ожидания для исключений, вызванных тестируемым кодом.

_Обратите внимание, что expectExceptionMessage утверждает, что_ _$actual_ _содержит_ _$expected_ _сообщение и не выполняет точное сравнение строк._

Кроме того, вы можете использовать аннотации @expectedException, @expectedExceptionCode, @expectedExceptionMessage и @expectedExceptionMessageRegExp, чтобы настроить ожидания для исключений, вызванных тестируемым кодом. Пример 2.12 показывает пример.

 

Пример 2.12 Использование аннотации @expectedException

```
<?php
use PHPUnit\Framework\TestCase;

class ExceptionTest extends TestCase
{
   /**
    * @expectedException InvalidArgumentException
    */
   public function testException()
   {
   }
}
```

 

```
$ phpunit ExceptionTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

F

Time: 0 seconds, Memory: 4.75Mb

There was 1 failure:

1) ExceptionTest::testException
Failed asserting that exception of type "InvalidArgumentException" is thrown.

FAILURES!
Tests: 1, Assertions: 1, Failures: 1.

```

 

## Тестирование ошибок PHP

По умолчанию PHPUnit преобразует ошибки PHP, предупреждения и уведомления, которые запускаются во время выполнения теста в исключения. Используя эти исключения, вы можете, например, ожидать, что тест вызовет ошибку PHP, как показано в примере 2.13.

 

> **Note:**
> 
> Конфигурация времени выполнения error\_reporting PHP может ограничивать, какие ошибки PHPUnit будет конвертировать в исключения. Если у вас возникли проблемы с этой функцией, убедитесь, что PHP не настроен на подавление типа ошибок, которые вы тестируете.

 

Пример 2.13 Ожидание ошибки PHP с использованием @expectedException

```
<?php
use PHPUnit\Framework\TestCase;

class ExpectedErrorTest extends TestCase
{
   /**
    * @expectedException PHPUnit\Framework\Error\Error
    */
   public function testFailingInclude()
   {
       include 'not_existing_file.php';
   }
}
```

 

```
$ phpunit -d error_reporting=2 ExpectedErrorTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

.

Time: 0 seconds, Memory: 5.25Mb

OK (1 test, 1 assertion)
```

 

PHPUnit\\Framework\\Error\\Notice и PHPUnit\\Framework\\Error\\Warning представляют собой уведомления и предупреждения PHP соответственно.

 

> **Note:**
> 
> При тестировании исключений вы должны быть как можно более конкретными. Тестирование для классов, которые являются слишком общими, может привести к нежелательным побочным эффектам. Соответственно, тестирование класса Exception с помощью @expectedException или expectException() больше не разрешено.

 

При тестировании, основанном на PHP функциях, которые запускают такие ошибки, как fopen, иногда бывает полезно использовать подавление ошибок во время тестирования. Это позволяет вам проверять возвращаемые значения, подавляя уведомления, которые приведут к PHPUnit\\Framework\\Error\\Notice.

 

Пример 2.14 Тестирование возвращаемых значений кода, использующего ошибки PHP

```
<?php
use PHPUnit\Framework\TestCase;

class ErrorSuppressionTest extends TestCase
{
   public function testFileWriting()
   {
       $writer = new FileWriter;

       $this->assertFalse(@$writer->write('/is-not-writeable/file', 'stuff'));
   }
}

class FileWriter
{
   public function write($file, $content)
   {
       $file = fopen($file, 'w');

       if ($file == false) {
           return false;
       }

       // ...
   }
}
```

```
$ phpunit ErrorSuppressionTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

.

Time: 1 seconds, Memory: 5.25Mb

OK (1 test, 1 assertion)

```

Без подавления ошибок тест не даст отчета fopen (/is-not-writeable/file): не удалось открыть поток: нет такого файла или каталога.

 

## Тестирование вывода (output)

Иногда вы хотите утверждать, что выполнение метода, например, генерирует ожидаемый результат (например, через echo или print). Класс PHPUnit \\ Framework \\ TestCase использует функцию буферизации вывода PHP [Output Buffering](http://www.php.net/manual/en/ref.outcontrol.php)  для обеспечения необходимых функций.

В примере 2.15 показано, как использовать метод expectOutputString() для установки ожидаемого результата. Если этот ожидаемый результат не будет сгенерирован, тест не сработает.

Пример 2.15 Тестирование вывода функции или метода

```
<?php
use PHPUnit\Framework\TestCase;

class OutputTest extends TestCase
{
   public function testExpectFooActualFoo()
   {
       $this->expectOutputString('foo');
       print 'foo';
   }

   public function testExpectBarActualBaz()
   {
       $this->expectOutputString('bar');
       print 'baz';
   }
}

```

```
$ phpunit OutputTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

.F

Time: 0 seconds, Memory: 5.75Mb

There was 1 failure:

1) OutputTest::testExpectBarActualBaz
Failed asserting that two strings are equal.
--- Expected
+++ Actual
@@ @@
-'bar'
+'baz'

FAILURES!
Tests: 2, Assertions: 2, Failures: 1.

```

В таблице 2.1 показаны методы, предоставляемые для тестирования вывода

Таблица 2.1 Методы тестирования вывода

 

| **Метод** | **Смысл** |
| --- | --- |
| void expectOutputRegex(string $regularExpression) | Настройте ожидание того, что результат соответствует $ regularExpression. |
| void expectOutputString(string $expectedString) | Настройте ожидание того, что результат равен $ expectedString. |
| bool setOutputCallback(callable $callback) | Устанавливает обратный вызов, который используется, например, для нормализации фактического вывода. |
| string getActualOutput() | Получить фактический вывод. |

 

> **Note:**
> 
> Тест, который возвращает вывод, не будет работать в strict режиме.

 

## Вывод ошибок

Всякий раз, когда тест не проходит, PHPUnit и пытается предоставить вам максимально возможный контекст, который может помочь выявить проблему.

 

Пример 2.16 Выход ошибки, сгенерированный при сбое сравнения массива

```
<?php
use PHPUnit\Framework\TestCase;

class ArrayDiffTest extends TestCase
{
   public function testEquality()
   {
       $this->assertSame(
           [1, 2,  3, 4, 5, 6],
           [1, 2, 33, 4, 5, 6]
       );
   }
}

```

```
$ phpunit ArrayDiffTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

F

Time: 0 seconds, Memory: 5.25Mb

There was 1 failure:

1) ArrayDiffTest::testEquality
Failed asserting that two arrays are identical.
--- Expected
+++ Actual
@@ @@
Array (
    0 => 1
    1 => 2
-    2 => 3
+    2 => 33
    3 => 4
    4 => 5
    5 => 6
)

/home/sb/ArrayDiffTest.php:7

FAILURES!
Tests: 1, Assertions: 1, Failures: 1.
```

В этом примере только одно из значений массива отличается, а остальные показывают, где возникает ошибка.

Когда сгенерированный вывод будет длинным для чтения, PHPUnit разделит его и предоставит несколько строк контекста вокруг каждой разницы.

Пример 2.17. Вывод ошибки при сравнении массива длинного массива

```
<?php
use PHPUnit\Framework\TestCase;

class LongArrayDiffTest extends TestCase
{
   public function testEquality()
   {
       $this->assertSame(
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2,  3, 4, 5, 6],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 33, 4, 5, 6]
       );
   }
}
```

 

```
$ phpunit LongArrayDiffTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

F

Time: 0 seconds, Memory: 5.25Mb

There was 1 failure:

1) LongArrayDiffTest::testEquality
Failed asserting that two arrays are identical.
--- Expected
+++ Actual
@@ @@
    11 => 0
    12 => 1
    13 => 2
-    14 => 3
+    14 => 33
    15 => 4
    16 => 5
    17 => 6
)

/home/sb/LongArrayDiffTest.php:7

FAILURES!
Tests: 1, Assertions: 1, Failures: 1
```

 

## "Краеугольный камень"

Когда сравнение не удается, PHPUnit создает текстовые представления входных значений и сравнивает их. Из-за этой реализации diff может показать больше проблем, чем фактически существует.

Это происходит только при использовании assertEquals() или других «слабых» функций сравнения на массивах или объектах.

Пример 2.18. diff при использовании слабого сравнения

```
<?php
use PHPUnit\Framework\TestCase;

class ArrayWeakComparisonTest extends TestCase
{
   public function testEquality()
   {
       $this->assertEquals(
           [1, 2, 3, 4, 5, 6],
           ['1', 2, 33, 4, 5, 6]
       );
   }
}

```

```
$ phpunit ArrayWeakComparisonTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

F

Time: 0 seconds, Memory: 5.25Mb

There was 1 failure:

1) ArrayWeakComparisonTest::testEquality
Failed asserting that two arrays are equal.
--- Expected
+++ Actual
@@ @@
Array (
-    0 => 1
+    0 => '1'
    1 => 2
-    2 => 3
+    2 => 33
    3 => 4
    4 => 5
    5 => 6
)

/home/sb/ArrayWeakComparisonTest.php:7

FAILURES!
Tests: 1, Assertions: 1, Failures: 1.
```

В этом примере сообщается разница в первом индексе между 1 и «1», хотя assertEquals() считает значения совпадающими.

[https://phpunit.readthedocs.io/ru/latest/writing-tests-for-phpunit.html](https://phpunit.readthedocs.io/ru/latest/writing-tests-for-phpunit.html)
