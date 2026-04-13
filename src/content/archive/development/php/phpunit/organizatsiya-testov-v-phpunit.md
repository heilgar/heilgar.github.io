---
title: "Организация тестов в PHPUnit"
date: 2018-09-19
categories: 
  - "phpunit"
---

Одна из целей PHPUnit заключается в том, что тесты должны быть составными: мы хотим запускать любое количество или комбинацию тестов вместе, например, все тесты для всего проекта, либо тесты всех классов компонента, который является частью проекта, либо просто тесты для одного класса.

PHPUnit поддерживает различные способы организации тестов и составления их в набор тестов. В этой главе показаны наиболее часто используемые подходы.

 

## Составление набора тестов с помощью файловой системы

Возможно, самый простой способ составить набор тестов — это держать все исходные файлы тестов в тестовом каталоге. PHPUnit может автоматически обнаруживать и запускать тесты путём рекурсивного обхода тестового каталога.

Давайте посмотрим на набор тестов библиотеки [sebastianbergmann/money](http://github.com/sebastianbergmann/money/). Просматривая структуру каталогов этого проекта, мы видим, что классы тестов в каталоге `tests` отражают структуру пакета и классов тестируемой системы в каталоге `src`:

```
src                                 tests
`-- Currency.php                    `-- CurrencyTest.php
`-- IntlFormatter.php               `-- IntlFormatterTest.php
`-- Money.php                       `-- MoneyTest.php
`-- autoload.php
```

Для запуска всех тестов библиотеки нам просто нужно указать исполнителю тестов командной строки PHPUnit каталог с тестами:

```
$ phpunit --bootstrap src/autoload.php tests
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

.................................

Time: 636 ms, Memory: 3.50Mb

OK (33 tests, 52 assertions)
```

> **Примечание**
> 
> Если вы укажите исполнителю тестов командной строки PHPUnit каталог, он будет искать файлы с маской `*Test.php`

Для запуска только тестов, объявленных в классе `CurrencyTest`, находящегося в файле `tests/CurrencyTest.php`, мы можем использовать следующую команду:

```
$ phpunit --bootstrap src/autoload.php tests/CurrencyTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

........

Time: 280 ms, Memory: 2.75Mb

OK (8 tests, 8 assertions)
```

Для более точного контроля, какие тесты запускать, мы можем использовать опцию `--filter`:

```
$ phpunit --bootstrap src/autoload.php --filter testObjectCanBeConstructedForValidConstructorArgument tests
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

..

Time: 167 ms, Memory: 3.00Mb

OK (2 test, 2 assertions)
```

> **Примечание**
> 
> Недостатком этого подхода является то, что мы не можем контролировать порядок выполнения тестов. Это может привести к проблемам с зависимостями теста см. [Зависимости тестов](https://phpunit.readthedocs.io/ru/latest/writing-tests-for-phpunit.html#writing-tests-for-phpunit-test-dependencies). В следующем разделе вы увидите, как можно явно задать порядок выполнения тестов, используя конфигурационный XML-файл.

 

## Составление набора тестов с помощью конфигурации XML

XML-файл конфигурации PHPUnit ([Конфигурационный XML-файл](https://phpunit.readthedocs.io/ru/latest/configuration.html#appendixes-configuration)) также может использоваться для составления набора тестов. [Пример 5.1](https://phpunit.readthedocs.io/ru/latest/organizing-tests.html#organizing-tests-xml-configuration-examples-phpunit-xml) показывает файл `phpunit.xml` с минимальной настройкой, который добавит все классы `*Test`, находящиеся в файлах`*Test.php`, после рекурсивного обхода каталога `tests`.

Пример 5.1 Составление набора тестов, используя конфигурацию XML

```
<phpunit bootstrap="src/autoload.php">
  <testsuites>
    <testsuite name="money">
      <directory>tests</directory>
    </testsuite>
  </testsuites>
</phpunit>
```

 

Если `phpunit.xml` или `phpunit.xml.dist` (в этом порядке) существует в текущем рабочем каталоге, а опция `--configuration` _не_ используется, то конфигурация будет автоматически считана из этого файла.

Порядок выполнения тестов можно сделать явным:

Пример 5.2 Составление набора тестов, используя конфигурацию XML

```
<phpunit bootstrap="src/autoload.php">
  <testsuites>
    <testsuite name="money">
      <file>tests/IntlFormatterTest.php</file>
      <file>tests/MoneyTest.php</file>
      <file>tests/CurrencyTest.php</file>
    </testsuite>
  </testsuites>
</phpunit>
```

[https://phpunit.readthedocs.io/ru/latest/organizing-tests.html](https://phpunit.readthedocs.io/ru/latest/organizing-tests.html)
