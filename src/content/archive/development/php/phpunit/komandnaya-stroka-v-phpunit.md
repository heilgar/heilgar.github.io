---
title: "Командная строка в PHPUnit"
date: 2018-09-18
categories: 
  - "phpunit"
---

С помощью команды phpunit можно запустить PHPUnit из командной строки. Следующий код показывает, как запускать тесты с помощью командной строки:

<!--more-->

```
$ phpunit ArrayTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

..

Time: 0 seconds

OK (2 tests, 2 assertions)

```

При вызове, как показано выше, команда будет искать исходный файл ArrayTest.php в текущем рабочем каталоге, загрузит его и будет искать тесты в классе ArrayTest. Затем он выполнит тесты этого класса.

Для каждого запуска инструмент командной строки PHPUnit печатает один символ для указания прогресса:

**.**

когда тест завершается успешно.

**F**

когда утверждение не выполняется при запуске метода тестирования.

**E**

при возникновении ошибки при запуске метода тестирования.

**R**

когда тест был отмечен как опасный (см. Рискованные тесты).

**S**

при пропуске теста (см. «Незавершенные и пропущенные тесты»).

**I**

когда тест отмечен как неполный или еще не реализованный (см. «Незавершенные и пропущенные тесты»).

PHPUnit различает сбой и ошибки. Сбой является нарушенным утверждением PHPUnit, таким как отказ вызова assertSame(). Ошибка - это неожиданное исключение или ошибка PHP. Иногда это различие оказывается полезным, поскольку ошибки, как правило, легче исправить, чем сбои. Если у вас есть большой список проблем, лучше всего сначала устранить ошибки и посмотреть, есть ли у вас какие-либо сбои, когда все они исправлены.

## Опции командной строки

Давайте посмотрим на параметры командной строки:

```
$ phpunit --help
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

Usage: phpunit [options] UnitTest [UnitTest.php]
      phpunit [options] <directory>

Code Coverage Options:

 --coverage-clover <file>    Generate code coverage report in Clover XML format.
 --coverage-crap4j <file>    Generate code coverage report in Crap4J XML format.
 --coverage-html <dir>       Generate code coverage report in HTML format.
 --coverage-php <file>       Export PHP_CodeCoverage object to file.
 --coverage-text=<file>      Generate code coverage report in text format.
                             Default: Standard output.
 --coverage-xml <dir>        Generate code coverage report in PHPUnit XML format.
 --whitelist <dir>           Whitelist <dir> for code coverage analysis.
 --disable-coverage-ignore   Disable annotations for ignoring code coverage.

Logging Options:

 --log-junit <file>          Log test execution in JUnit XML format to file.
 --log-teamcity <file>       Log test execution in TeamCity format to file.
 --testdox-html <file>       Write agile documentation in HTML format to file.
 --testdox-text <file>       Write agile documentation in Text format to file.
 --testdox-xml <file>        Write agile documentation in XML format to file.
 --reverse-list              Print defects in reverse order

Test Selection Options:

 --filter <pattern>          Filter which tests to run.
 --testsuite <name,...>      Filter which testsuite to run.
 --group ...                 Only runs tests from the specified group(s).
 --exclude-group ...         Exclude tests from the specified group(s).
 --list-groups               List available test groups.
 --list-suites               List available test suites.
 --test-suffix ...           Only search for test in files with specified
                             suffix(es). Default: Test.php,.phpt

Test Execution Options:

 --dont-report-useless-tests Do not report tests that do not test anything.
 --strict-coverage           Be strict about @covers annotation usage.
 --strict-global-state       Be strict about changes to global state
 --disallow-test-output      Be strict about output during tests.
 --disallow-resource-usage   Be strict about resource usage during small tests.
 --enforce-time-limit        Enforce time limit based on test size.
 --disallow-todo-tests       Disallow @todo-annotated tests.

 --process-isolation         Run each test in a separate PHP process.
 --globals-backup            Backup and restore $GLOBALS for each test.
 --static-backup             Backup and restore static attributes for each test.

 --colors=<flag>             Use colors in output ("never", "auto" or "always").
 --columns <n>               Number of columns to use for progress output.
 --columns max               Use maximum number of columns for progress output.
 --stderr                    Write to STDERR instead of STDOUT.
 --stop-on-error             Stop execution upon first error.
 --stop-on-failure           Stop execution upon first error or failure.
 --stop-on-warning           Stop execution upon first warning.
 --stop-on-risky             Stop execution upon first risky test.
 --stop-on-skipped           Stop execution upon first skipped test.
 --stop-on-incomplete        Stop execution upon first incomplete test.
 --fail-on-warning           Treat tests with warnings as failures.
 --fail-on-risky             Treat risky tests as failures.
 -v|--verbose                Output more verbose information.
 --debug                     Display debugging information.

 --loader <loader>           TestSuiteLoader implementation to use.
 --repeat <times>            Runs the test(s) repeatedly.
 --teamcity                  Report test execution progress in TeamCity format.
 --testdox                   Report test execution progress in TestDox format.
 --testdox-group             Only include tests from the specified group(s).
 --testdox-exclude-group     Exclude tests from the specified group(s).
 --printer <printer>         TestListener implementation to use.

Configuration Options:

 --bootstrap <file>          A "bootstrap" PHP file that is run before the tests.
 -c|--configuration <file>   Read configuration from XML file.
 --no-configuration          Ignore default configuration file (phpunit.xml).
 --no-coverage               Ignore code coverage configuration.
 --no-extensions             Do not load PHPUnit extensions.
 --include-path <path(s)>    Prepend PHP's include_path with given path(s).
 -d key[=value]              Sets a php.ini value.
 --generate-configuration    Generate configuration file with suggested settings.

Miscellaneous Options:

 -h|--help                   Prints this usage information.
 --version                   Prints the version and exits.
 --atleast-version <min>     Checks that version is greater than min and exits.
```

phpunit UnitTest

Выполняет тесты, которые предоставляются классом UnitTest. Ожидается, что этот класс будет объявлен в исходном файле UnitTest.php.

UnitTest должен быть либо классом, который наследуется от PHPUnit\\Framework\\TestCase, либо класса, который предоставляет public static suite(), который возвращает объект PHPUnit\\Framework\\Test, например экземпляр класса PHPUnit\\Framework\\TestSuite.

phpunit UnitTest UnitTest.php

Выполняет тесты, которые предоставляются классом UnitTest. Ожидается, что этот класс будет объявлен в указанном исходном файле.

\--coverage-clover

Создает файл журнала в формате XML с информацией о покрытии кода для запуска тестов. Дополнительную информацию см. В разделе Логирование.

Обратите внимание, что эта функция доступна только в том случае, если установлены расширения tokenizer и Xdebug.

\--coverage-crap4j

Создает отчет о покрытии кода в формате Crap4j. Дополнительную информацию см. В разделе Анализ покрытия кода.

Обратите внимание, что эта функция доступна только в том случае, если установлены расширения tokenizer и Xdebug.

\--coverage-html

Создает отчет о покрытии кода в формате HTML. Дополнительную информацию см. В разделе Анализ покрытия кода.

Обратите внимание, что эта функция доступна только в том случае, если установлены расширения tokenizer и Xdebug.

\--coverage-php

Создает сериализованный объект PHP\_CodeCoverage с информацией о покрытии кода.

Обратите внимание, что эта функция доступна только в том случае, если установлены расширения tokenizer и Xdebug.

\--coverage-text

Создает файл журнала или вывод командной строки в формате для чтения человеком с информацией о покрытии кода для запуска тестов. Дополнительную информацию см. В разделе «Логирование».

Обратите внимание, что эта функция доступна только в том случае, если установлены расширения tokenizer и Xdebug.

\--log-junit

Создает файл журнала в формате JUnit XML для запуска тестов. Дополнительную информацию см. В разделе Логирование.

\--testdox-html and \--testdox-text

Создает гибкую документацию в формате HTML или в обычном текстовом формате для запуска тестов (см. TestDox).

\--filter

Выполняет только тесты, имя которых соответствует заданному шаблону регулярного выражения. Если шаблон не заключен в разделители, PHPUnit будет заключать шаблон в / разделители.

Имена тестов для соответствия будут в одном из следующих форматов:

TestNamespace\\TestCaseClass::testMethod

Формат имени теста по умолчанию эквивалентен использованию магической константы \_\_METHOD\_\_ внутри метода тестирования.

TestNamespace\\TestCaseClass::testMethod with data set #0

Когда в тесте есть поставщик данных, каждая итерация данных получает текущий индекс, добавляемый к концу имени теста по умолчанию.

TestNamespace\\TestCaseClass::testMethod with data set "my named data"

Когда в тесте есть поставщик данных, который использует именованные наборы, каждая итерация данных получает текущее имя, добавленное к концу имени теста по умолчанию. См. Пример 3.1 для примера названных наборов данных.

Пример 3.1 Именованные наборы данных

```
<?php
use PHPUnit\Framework\TestCase;

namespace TestNamespace;

class TestCaseClass extends TestCase
{
    /**
     * @dataProvider provider
     */
    public function testMethod($data)
    {
        $this->assertTrue($data);
    }

    public function provider()
    {
        return [
            'my named data' => [true],
            'my data'       => [true]
        ];
    }
}
```

```
/path/to/my/test.phpt
```

Имя теста для теста PHPT - путь к файловой системе. См. Пример 3.2  допустимые шаблонов фильтров.

Пример 3.2 Допустимые шаблонов фильтров

```
--filter 'TestNamespace\\TestCaseClass::testMethod'
--filter 'TestNamespace\\TestCaseClass'
--filter TestNamespace
--filter TestCaseClase
--filter testMethod
--filter '/::testMethod .*"my named data"/'
--filter '/::testMethod .*#5$/'
--filter '/::testMethod .*#(5|6|7)$/'
```

См. Пример 3.3 сокращения в фильтрах, доступных для сопоставления поставщиков данных.

Пример 3.3. Сокращения в фильтрах

```
--filter 'testMethod#2'
--filter 'testMethod#2-4'
--filter '#2'
--filter '#2-4'
--filter 'testMethod@my named data'
--filter 'testMethod@my.*data'
--filter '@my named data'
--filter '@my.*data'
```

`--testsuite`

> Выполняется только тестовый набор, чье имя соответствует заданному шаблону.

`--group`

> Выполняет только тесты из указанной группы (групп). Тест может быть помечен как принадлежащий группе, используя аннотацию @group.
> 
> Аннотации @author и @ticket - это псевдонимы для @group, позволяющие фильтровать тесты на основе их авторов или их идентификаторов билетов соответственно.

`--exclude-group`

> Исключить тесты из указанной группы (групп). Тест может быть помечен как принадлежащий группе, используя аннотацию @group.

`--list-groups`

> Список доступных тестовых групп.

`--test-suffix`

> Только поиск тестовых файлов с указанными суффиксами.

`--dont-report-useless-tests`

> Не отображать тесты, которые ничего не тестируют. Подробнее см. Рискованные тесты.

`--strict-coverage`

> Строгая проверка относительно непреднамеренно охваченного кода. Подробнее см. Рискованные тесты.

`--strict-global-state`

> Стрикт мод для манипуляций над глобальным состоянием. Подробнее см. Рискованные тесты.

`--disallow-test-output`

> Стрикт мод по отношению к результатам возращаемым тестами.

`--disallow-todo-tests`

> Не выполняет тесты с аннотацией @todo в своем докблоке.

`--enforce-time-limit`

> Установите ограничение по времени на основе размера теста. Подробнее см. Рискованные тесты.

`--process-isolation`

> Запускает каждый тест в отдельном PHP-процессе.

`--no-globals-backup`

> Не копирует и не восстанавливайте $GLOBALS. См. Глобальное состояние для получения более подробной информации.

`--static-backup`

> Резервное копирование и восстановление статических атрибутов пользовательских классов. См. Глобальное состояние для получения более подробной информации.

`--colors`

>  
> 
> Используйте цвета в выводе. В Windows используйте [ANSICON](https://github.com/adoxa/ansicon) или [ConEmu](https://github.com/Maximus5/ConEmu).
> 
> Существует три возможных значения для этого параметра:
> 
> - `never`: никогда не отображает цвета в выводе. Это значение по умолчанию, когда `--colors` опция не используеться.
> - `auto`: отображает цвета в выводе, если текущий терминал не поддерживает цвета, или если вывод передан в команду или перенаправлен в файл.
> - `always`: всегда отображает цвета, даже если текущий терминал не поддерживает цвета, или когда вывод передается в команду или перенаправляется в файл.
> 
> Когда опция `--colors` используеться без значения, `auto` будет выставлен по умолчанию.

`--columns`

> Определяет количество столбцов для вывода результатов. Если max определяется как значение, количество столбцов будет максимальным для текущего терминала.

`--stderr`

> Опциональная печатать в STDERR вместо STDOUT.

`--stop-on-error`

> Прекратить выполнение при первой ошибке.

`--stop-on-failure`

> Прекратить выполнение при первой ошибке или сбое.

`--stop-on-risky`

> Прекратить выполнение при первом рискованном тестировании.

`--stop-on-skipped`

> Прекратить выполнение при первом пропущенном тесте.

`--stop-on-incomplete`

> Прекратить выполнение при первом незавершенном тесте.

`--verbose`

> Вывести более подробную информацию, например, имена тестов, которые были неполными или были пропущены.

`--debug`

> Вывод отладочной информации, такой как имя теста при его запуске.

`--loader`

> Указывает реализацию `PHPUnit\Runner\TestSuiteLoader`.
> 
> Стандартный загрузчик тестового набора будет искать исходный файл в текущем рабочем каталоге и в каждом каталоге, указанном в директиве конфигурации PHP `include_path`. Имя класса, например `Project_Package_Class`, сопоставляется с исходным именем файла `Project/Package/Class.php`

`--repeat`

> Неоднократно выполнять тест(ы) указанного количества раз.

`--testdox`

> Сообщает о ходе тестирования в формате TestDox (см. TestDox).

`--printer`

> Указывает используемый принтер результатов. Класс принтера должен расширять `PHPUnit\Util\Printer` и реализовывать интерфейс `PHPUnit\Framework\TestListener`.

`--bootstrap`

> «Загрузочный» PHP-файл, который запускается перед тестированием.

`--configuration`, `-c`

>  
> 
> Если `phpunit.xml` или `phpunit.xml.dist` (в этом порядке) существуют в текущем рабочем каталоге и `--configuration` не используется, конфигурация будет автоматически считана из этого файла.
> 
> Если указан каталог и если в этом каталоге существует `phpunit.xml` или `phpunit.xml.dist` (в этом порядке), конфигурация автоматически считывается из этого файла.

`--no-configuration`

> Пропустить `phpunit.xml` и `phpunit.xml.dist` в текущей рабочей директории

`--include-path`

> Подготовить PHP `include_path` с заданным путем (-ами).

`-d`

> Устанавливает значение данного параметра конфигурации PHP.

> Обратите внимание, что начиная с 4.8 параметры могут быть заданы после аргументов.

## TestDox

Функционал TestDox просматривает тестовый класс и все имена методов тестирования и преобразует их из имен camelCase (или snake\_case) в предложения: testBalanceIsInitiallyZero() (или test\_balance\_is\_initially\_zero() становится «Изначально нулевой баланс» .Если есть несколько методов, имена которых отличаются только суффиксом одной или нескольких цифр, например testBalanceCannotBecomeNegative() и testBalanceCannotBecomeNegative2(), предложение «Баланс не может стать отрицательным» появится только один раз, предполагая, что все эти тесты будут успешными.

Давайте посмотрим на документацию, созданную для класса BankAccount:

```
$ phpunit --testdox BankAccountTest
PHPUnit |version|.0 by Sebastian Bergmann and contributors.

BankAccount
 ✔ Balance is initially zero
 ✔ Balance cannot become negative
```

В качестве альтернативы, гибкая документация может быть сгенерирована в формате HTML или обычного текста и записана в файл с использованием аргументов \--testdox-html и \--testdox-text.

Agile Documentation может использоваться для документирования допущений, которые делаете о внешних пакетах, которые используете в своем проекте. Когда вы используете внешний пакет, вы подвергаетесь рискам, что пакет не будет вести себя так, как вы ожидаете, и что будущие версии пакета будут изменяться такими способами, которые нарушают ваш код, не зная об этом. Вы можете устранить эти риски, написав тест каждый раз, когда вы делаете предположение. Если ваш тест будет успешным, ваше предположение будет действительным. Если вы документируете все свои предположения с помощью тестов, будущие выпуски внешнего пакета не будут вызывать беспокойства: если тесты будут успешными, ваша система должна продолжать работать.

 

[https://phpunit.readthedocs.io/ru/latest/textui.html](https://phpunit.readthedocs.io/ru/latest/textui.html)
