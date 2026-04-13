---
title: "Неполные и пропущенные тесты"
date: 2018-09-24
categories: 
  - "phpunit"
---

## Неполные тесты

Когда вы работаете над новым тестовым классом, вы можете начать с написания пустых тестовых методов для отслеживания тех тестов, которые нужно написать, например:

```
public function testSomething()
{
}
```

Проблема с пустыми тестовыми методами состоит в том, что фреймворком PHPUnit они интерпретируется как успешно пройденные. Это ошибочное толкование приводит к тому, что отчёты о покрытии становятся бесполезными — вы не сможете увидеть, действительно ли тест прошёл, либо он просто ещё не реализован. Вызов `$this->fail()` в нереализованном тестовом методе также не поможет, поскольку тогда тест будет интерпретироваться как не пройденный. Это было бы так же неверно, как и считать нереализованный тест как пройденный.

Если мы думаем об успешном тестировании как о зелёном свете, а о непройденном тесте как о красном цвете, то нам нужен дополнительный жёлтый цвет для обозначения теста как неполного или ещё не реализованного. `PHPUnit\Framework\IncompleteTest` — это интерфейс для обозначения исключения, выбрасываемого тестовым методом как результат на то, что данный тестовый метод неполный или в данный момент ещё не реализован.`PHPUnit\Framework\IncompleteTestError` — стандартная реализация этого интерфейса.

Пример 7.1 показывает тестовый класс `SampleTest`, содержащий один тестовый метод `testSomething()`. Вызывая удобный метод `markTestIncomplete()` (который автоматически вызывает исключение `PHPUnit\Framework\IncompleteTestError`) в тестовом методе, мы отмечаем, что данный тест является неполным.

Пример 7.1 Маркировка теста как неполного

```
<?php
use PHPUnit\Framework\TestCase;

class SampleTest extends TestCase
{
    public function testSomething()
    {
        // Необязательно: протестируйте здесь что-нибудь, если хотите.
        $this->assertTrue(true, 'This should already work.');

        // Остановиться тут и отметить, что тест неполный.
        $this->markTestIncomplete(
          'Этот тест ещё не реализован.'
        );
    }
}
```

Неполный тест обозначается `I` в выводе исполнителя тестов командной строки PHPUnit, как показано в следующем примере:

```
$ phpunit --verbose SampleTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

I

Time: 0 seconds, Memory: 3.95Mb

There was 1 incomplete test:

1) SampleTest::testSomething
Этот тест ещё не реализован.

/home/sb/SampleTest.php:12
OK, but incomplete or skipped tests!
Tests: 1, Assertions: 1, Incomplete: 1.
```

Таблица 7.1 показывает API для маркировки тестов как неполных.

| Метод | Описание |
| --- | --- |
| `void markTestIncomplete()` | Помечает текущий тест как неполный. |
| `void markTestIncomplete(string $message)` | Помечает текущий тест как неполный, используя $message в качестве пояснительного сообщения. |

## Пропущенные тесты

Не все тесты могут выполняться в любом окружении. Рассмотрим, например, уровень абстракции базы данных, содержащий несколько драйверов для различных систем баз данных, которые он поддерживает. Разумеется, тесты для драйвера MySQL могут выполняться только в том случае, если доступен сервер MySQL.

Пример 7.2 демонстрирует тестовый класс `DatabaseTest`, содержащий один тестовый метод `testConnection()`. В шаблонном методе `setUp()` тестового класса мы проверяем, доступно ли расширение MySQLi, и используем метод `markTestSkipped()` для пропуска этого теста в противном случае.

Пример 7.2 Пропуск теста

```
<?php
use PHPUnit\Framework\TestCase;

class DatabaseTest extends TestCase
{
    protected function setUp()
    {
        if (!extension_loaded('mysqli')) {
            $this->markTestSkipped(
              'Расширение MySQLi недоступно.'
            );
        }
    }

    public function testConnection()
    {
        // ...
    }
}
```

Пропущенный тест обозначается `S` в выводе исполнителя тестов командной строки PHPUnit, как показано в следующем примере:

```
$ phpunit --verbose DatabaseTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

S

Time: 0 seconds, Memory: 3.95Mb

There was 1 skipped test:

1) DatabaseTest::testConnection
Расширение MySQLi недоступно.

/home/sb/DatabaseTest.php:9
OK, but incomplete or skipped tests!
Tests: 1, Assertions: 0, Skipped: 1.
```

Таблица 7.2 показывает API пропущенных тестов.

| Метод | Описание |
| --- | --- |
| `void markTestSkipped()` | Отмечает текущий тест как пропущенный. |
| `void markTestSkipped(string $message)` | Отмечает текущий тест как пропущенный, используя `$message` в качестве пояснительного сообщения. |

## Пропуск тестов с помощью @requires

В дополнение к вышеперечисленным методам можно также использовать аннотацию`@requires`, чтобы предоставить общие предварительные условия для тестового класса.

Таблица 7.3 Возможные примеры использования @requires    
| Тип | Возможные значения | Примеры | Дополнительный пример |
| --- | --- | --- | --- |
| `PHP` | Любой идентификатор версии PHP | @requires PHP 5.3.3 | @requires PHP 7.1-dev |
| `PHPUnit` | Любой идентификатор версии PHPUnit | @requires PHPUnit 3.6.3 | @requires PHPUnit 4.6 |
| `OS` | Регулярное выражения для [PHP\_OS](http://php.net/manual/ru/reserved.constants.php#constant.php-os) | @requires OS Linux | @requires OS WIN32\|WINNT |
| `OSFAMILY` | Любое [семейство ОС](http://php.net/manual/ru/reserved.constants.php#constant.php-os-family) | @requires OSFAMILY Solaris | @requires OSFAMILY Windows |
| `function` | Любой корректный параметр для [function\_exists](http://php.net/ru/function_exists) | @requires function imap\_open | @requires function ReflectionMethod::setAccessible |
| `extension` | Имя расширения вместе с необязательным идентификатором версии | @requires extension mysqli | @requires extension redis 2.2.0 |

Пример 7.3 Пропуск тестового класса с использованием @requires

```
<?php
use PHPUnit\Framework\TestCase;

/**
 * @requires extension mysqli
 */
class DatabaseTest extends TestCase
{
    /**
     * @requires PHP 5.3
     */
    public function testConnection()
    {
        // Тест требует расширения mysqli и PHP >= 5.3
    }

    // ... Все остальные тесты требует расширения mysqli
}
```

Если вы используете синтаксис, который не компилируется с определённой версией PHP, посмотрите на версии, от которых зависят тестовые классы в XML-конфигурации (см Набор тестов)

[https://phpunit.readthedocs.io/ru/latest/incomplete-and-skipped-tests.html](https://phpunit.readthedocs.io/ru/latest/incomplete-and-skipped-tests.html)
