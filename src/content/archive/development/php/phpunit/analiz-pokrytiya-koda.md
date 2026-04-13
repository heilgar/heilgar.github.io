---
title: "Анализ покрытия кода"
date: 2018-09-25
categories: 
  - "phpunit"
---

> _Википедия_:
> 
> В информатике покрытие кода — мера, используемая для описания степени, в которой исходной код программы протестирован определённым набором тестов. Программа с высоким покрытием кода была более тщательно протестирована и имеет меньше шансов содержать ошибки программного обеспечения, чем программа с низким покрытием кода тестами.

В этой главе вы узнаете всё о функциональности покрытия кода PHPUnit, которая даёт представление о том, какие части кода выполняются при выполнении тестов. Она использует компонент [php-code-coverage](https://github.com/sebastianbergmann/php-code-coverage), который, в свою очередь, использует функциональность покрытия кода, предоставляемую PHP-расширением [Xdebug](https://xdebug.org/).

Примечание

Xdebug не распространяется как часть PHPUnit. Если во время тестирования вы получаете уведомление о том, что драйвер покрытия кода отсутствует, это означает, что Xdebug либо не установлен, либо неправильно настроен. Прежде чем вы сможете использовать возможности анализа покрытия кода, вам следует [прочитать руководство по установке Xdebug](https://xdebug.org/docs/install).

php-code-coverage также поддерживает [phpdbg](https://phpdbg.room11.org/introduction.html) в качестве альтернативного источника для данных покрытия кода.

PHPUnit может генерировать отчёт о покрытии кода на основе HTML, а также лог-файлы в представлении XML с информацией о покрытии кода в различных форматах (Clover, Crap4J, PHPUnit). Информация о покрытии кода также может быть представлена в виде текста (и напечатана в STDOUT) и экспортирована как код PHP для дальнейшей обработки.

Обратитесь к [Исполнитель тестов командной строки](http://thewebland.net/development/php/phpunit/komandnaya-stroka-v-phpunit/) для просмотра списка переключателей командной строки, которые управляют функциональностью покрытия кода, а также Логирование для получения соответствующих параметров конфигурации.

 

## Показатели программного обеспечения покрытия кода

Существуют различные показатели (метрики) программного обеспечения (далее просто «показатель») для оценки покрытия кода:

_Покрытие строки (Line Coverage)_

> Показатель _Line Coverage_ определяет, была ли выполнена каждая исполняемая строка.

_Покрытие функции и метода (Function and Method Coverage)_

> Показатель _Function and Method Coverage_ определяет, была ли вызвана каждая функция или метод. php-code-coverage рассматривает функцию или метод как покрытую тестом, только когда все исполняемые строки покрыты.

_Покрытие класса и трейта (Class and Trait Coverage)_

> Показатель _Class and Trait Coverage_ определяет, был ли покрыт каждый метод класса или трейта. php-code-coverage рассматривает класс или трейт как покрытый, только когда все их методы покрыты.

_Покрытие кода операции (Opcode Coverage)_

> Показатель _Opcode Coverage_ определяет, выполнялся ли каждый опкод (код операции, opcode) функции или метода во время выполнения набора тестов. Строка кода обычно компилируется в несколько кодов опкодов. _Line Coverage_ рассматривает строку как покрытую, как только один из опкодов будет выполнен.

_Покрытие ветки (Branch Coverage)_

> Показатель _Branch Coverage_ определяет, было ли логическое выражение каждой управляющей структуры оценено как `true`, так и [\`\`](https://phpunit.readthedocs.io/ru/latest/code-coverage-analysis.html#id4)false\` при выполнении набора тестов.

_Покрытие пути (Path Coverage)_

> Показатель _Path Coverage_ определяет, использовался ли каждый из возможных путей выполнения функции или метода во время выполнения набора тестов. Путь выполнения — это уникальная последовательность ветвей от входа функции или метода до его выхода.

_Индекс Change Risk Anti-Patterns (CRAP)_

> Индекс _Change Risk Anti-Patterns (CRAP)_ рассчитывается на основе цикломатической сложности и покрытия кода единицы кода. Код, который не слишком сложный и имеет адекватный процент покрытия кода, будет иметь низкий индекс CRAP. Индекс CRAP может быть снижен путём написания тестов и рефакторинга тестов для уменьшения его сложности.

Примечание

Показатели _Opcode Coverage_, _Branch Coverage_ и _Path Coverage_ ещё не поддерживаются php-code-coverage.

 

## Белый список файлов

Необходимо настроить _белый список_ (_whitelist_) для указания PHPUnit, какие файлы исходного кода следует включить в отчёт о покрытии кода. Это можно сделать либо используя опцию командной строки `--whitelist`, либо через файл конфигурации (см. Файлы в белом списке для покрытия кода).

Доступны параметры конфигурации `addUncoveredFilesFromWhitelist` и `processUncoveredFilesFromWhitelist` для настройки использования белого списка:

- `addUncoveredFilesFromWhitelist="false"` означает, что в отчёт о покрытии кода будут включены только файлы из белого списка, содержащие хотя бы одну строку выполненного кода
- `addUncoveredFilesFromWhitelist="true"` (по умолчанию) означает, что все файлы из белого списка будут включены в отчёт о покрытии кода, даже если ни одна строка кода такого файла не была выполнена
- `processUncoveredFilesFromWhitelist="false"` (по умолчанию) означает, что в отчёт о покрытии кода будет включены файлы из белого списка, у которых нет исполненных строк кода (если установлено `addUncoveredFilesFromWhitelist="true"`), но он не будет загружен PHPUnit и поэтому не будет анализироваться для корректной информации о исполненных строк кода
- `processUncoveredFilesFromWhitelist="true"` означает, что файл в белом списке, у которого нет исполненных строк кода, будет загружен PHPUnit, чтобы его можно было анализировать для корректной информации о исполненных строк

Примечание

Обратите внимание, что загрузка файлов исходного кода, выполняемая при установке`processUncoveredFilesFromWhitelist="true"`, может вызвать проблемы, например, когда файл исходного кода содержит код вне области класса или функции.

 

## Игнорирование блоков кода

Иногда у вас есть блоки кода, которые вы не можете протестировать и поэтому вы можете игнорировать при анализе покрытия кода. PHPUnit позволяет сделать это с использованием аннотаций `@codeCoverageIgnore`, `@codeCoverageIgnoreStart` и `@codeCoverageIgnoreEnd`, как показано в Пример 10.1.

Пример 10.1 Использование аннотаций `@codeCoverageIgnore`, `@codeCoverageIgnoreStart` и `@codeCoverageIgnoreEnd`

```
<?php
use PHPUnit\Framework\TestCase;

/**
 * @codeCoverageIgnore
 */
class Foo
{
    public function bar()
    {
    }
}

class Bar
{
    /**
     * @codeCoverageIgnore
     */
    public function foo()
    {
    }
}

if (false) {
    // @codeCoverageIgnoreStart
    print '*';
    // @codeCoverageIgnoreEnd
}

exit; // @codeCoverageIgnore
```

 

Пропущенные строки кода (отмеченные как игнорируемые с помощью аннотаций) считаются выполненными (если они могут быть исполнены) и не будут подсвечиваться.

 

## Определение покрытых методов

Аннотация `@covers` (см. appendixes.annotations.covers.tables.annotations) может использоваться в тестовом коде для указания, какие методы тестовый метод хочет протестировать. Если она указана, то в информации о покрытии кода будут будут только эти указанные методы. Пример 10.2 показывает это на примере.

Пример 10.2 Тесты, в которых указывается, какой метод они хотят покрыть

```
<?php
use PHPUnit\Framework\TestCase;

class BankAccountTest extends TestCase
{
    protected $ba;

    protected function setUp()
    {
        $this->ba = new BankAccount;
    }

    /**
     * @covers BankAccount::getBalance
     */
    public function testBalanceIsInitiallyZero()
    {
        $this->assertSame(0, $this->ba->getBalance());
    }

    /**
     * @covers BankAccount::withdrawMoney
     */
    public function testBalanceCannotBecomeNegative()
    {
        try {
            $this->ba->withdrawMoney(1);
        }

        catch (BankAccountException $e) {
            $this->assertSame(0, $this->ba->getBalance());

            return;
        }

        $this->fail();
    }

    /**
     * @covers BankAccount::depositMoney
     */
    public function testBalanceCannotBecomeNegative2()
    {
        try {
            $this->ba->depositMoney(-1);
        }

        catch (BankAccountException $e) {
            $this->assertSame(0, $this->ba->getBalance());

            return;
        }

        $this->fail();
    }

    /**
     * @covers BankAccount::getBalance
     * @covers BankAccount::depositMoney
     * @covers BankAccount::withdrawMoney
     */
    public function testDepositWithdrawMoney()
    {
        $this->assertSame(0, $this->ba->getBalance());
        $this->ba->depositMoney(1);
        $this->assertSame(1, $this->ba->getBalance());
        $this->ba->withdrawMoney(1);
        $this->assertSame(0, $this->ba->getBalance());
    }
}
```

 

Также можно указать, что тест не должен покрывать _какой-либо_ метод, используя аннотацию`@coversNothing` (см. @coversNothing). Это может быть полезно при написании интеграционных тестов, чтобы убедиться, что вы только генерируете покрытие кода с помощью модульных тестов.

Пример 10.3 Тест, который указывает, что ни один метод не должен быть покрыт

```
<?php
use PHPUnit\DbUnit\TestCase

class GuestbookIntegrationTest extends TestCase
{
    /**
     * @coversNothing
     */
    public function testAddEntry()
    {
        $guestbook = new Guestbook();
        $guestbook->addEntry("suzy", "Hello world!");

        $queryTable = $this->getConnection()->createQueryTable(
            'guestbook', 'SELECT * FROM guestbook'
        );

        $expectedTable = $this->createFlatXmlDataSet("expectedBook.xml")
                              ->getTable("guestbook");

        $this->assertTablesEqual($expectedTable, $queryTable);
    }
}
```

 

 

## Крайние случаи

В этом разделе показаны заслуживающие внимания крайние случаи, которые приводят к путанице информации о покрытии кода.

```
<?php
use PHPUnit\Framework\TestCase;

// Потому этот код "находится на одной строке", а в не отдельном блоке инструкций,
// в одной строке всегда будет один статус покрытия
if (false) this_function_call_shows_up_as_covered();

// Из-за того, как покрытие кода работает внутри, эти две строки — особенные.
// Эта строка будет отображаться как не исполняемая
if (false)
    // Эта строка будет отображаться как покрытая, потому что на самом деле
    // покрытие оператора if в строке выше показано здесь!
    will_also_show_up_as_covered();

// Чтобы избежать этого, необходимо использовать фигурные скобки
if (false) {
    this_call_will_never_show_up_as_covered();
}
```
