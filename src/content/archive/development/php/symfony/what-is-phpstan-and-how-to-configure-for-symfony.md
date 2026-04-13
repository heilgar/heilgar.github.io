---
title: "Что такое PHPStan и как настроить для Symfony"
date: 2020-02-02
categories: 
  - "symfony"
tags: 
  - "code-quality"
  - "php-2"
  - "phpstan"
  - "symfony"
---

PHPStan - это фантастический инструмент [сатического анализа](https://ru.wikipedia.org/wiki/Статический_анализ_кода) (что и зачем -> [https://ru.wikipedia.org/wiki/Статический\__анализ\__кода](https://ru.wikipedia.org/wiki/Статический_анализ_кода) ) кода PHP. PHPStan - читает код и PHPDoc и пытаеться обнаружить потенциальные проблемы, такие как:

- вызов неопределенных переменных
- передача неверных типов данных
- использование несуществующих методов и атрибутов
- передача неверного количества параметов в метод
- использование возможных нулевых указателей
- и т.д.

Кроме анализа обычного PHP-кода, PHPStan может понимать некоторые специфические для фреймворка процессы с помощью расширений.

На момент публикации PHPStan поддерживает:

- Symfony
- Doctrine
- PHPUnit
- Nette
- Dibi

А так же есть ряд других не-официальных расширений, для:

- Laravel
- Yii2
- TYPO3
- Wordpress
- Drupal

С полным списком расширений можно ознакомиться в репозитории: [https://github.com/phpstan/phpstan](https://github.com/phpstan/phpstan)

Но давайте приступим к настройке:

## Установка PHPStan

Вы можете установить PHPStan либо напрямую со всеми его зависимостями, запустив:

```
composer require --dev phpstan/phpstan
```

Или вы можете установить phpstan-shim:

```
composer require --dev phpstan/phpstan-shim
```

Преимущество phpstan-shim состоит в том, что это файл Phar со всеми зависимостями, упакованными внутри (и с префиксом), поэтому они не будут конфликтовать с другими зависимостями, которые могут быть в вашем проекте. Поэтому я предпочитаю использовать phpstan-shim.

Чтобы автоматически настроить расширения, вам нужно установить phpstan/extension-installer:

```
composer require --dev phpstan/extension-installer
```

## Использование PHPStan

PHPStan можно запустить следующим образом:

```
vendor/bin/phpstan analyse -l 0 src tests
```

Комманда, вероятно, найдет вам кучу ошибок в зависимости от размера вашего проекта и возраста. Наилучшим подходом будет постепенно устранять проблемы и повышать уровень "строгости" проверки (-l 1).

Если есть проблемы, которые не могут быть легко устранены, вы можете исключить их из отчета. При этом старайтесь быть конкретным и укажите имя файла в исключении, чтобы не исключать проблемы из всего проекта. И не забывайте правильно экранировать регулярные выражения, иначе вы можете исключить больше вещей, чем вы хотели. Эти исключения должны быть включены в файл конфигурации phpstan.neon (который передается как -c phpstan.neon в команду анализа).

## Добавляем PHPStan в CI билд

Чтобы предотвратить повторное возникновение проблем в кодовой базе, вы должны добавить PHPStan в свой CI, чтобы он находил новые ошибки.

Это можно легко сделать с помощью Composer Scripts. Ваш раздел скриптов в composer.json может выглядеть так:

```
"scripts": {     
    "phpstan": "phpstan analyse -c phpstan.neon src tests --level 7 --no-progress",      
    "tests": "phpunit",         
    "ci": [         
        "@phpstan",         
        "@tests"    
    ], 
}
```

Когда вы запустите `composer ci` - `composer` запустит скрипты `phpstan` и `tests`

> Если вы уже используете какой-либо фреймворк - то скорее всего у вас уже есть раздел `scripts` в вашем `composer.json`

Все написанное дальше, подразумевает, что вы имеете опыт работы с Symfony/PHPUnit/Doctrine.

## Настраиваем PHPStan расширение для Symfony

Собственно, вот мы и добрались до места, где начнеться ответ на вопрос: "Как настроить PHPStan для Symfony"

Возможно, вы заметили, что PHPStan сообщает о некоторых проблемах в Symfony коде, который работает нормально. Это потому, что PHPStan не может понять магию Symfony только из самого кода. А она, магия, включает в себя получение сервисов из контейнера (вы не должны делать это в любом случае!), Работу с аргументами и опциями в командах и многое другое.

Чтобы эти ошибки исчезли, вам нужно установить расширение phpstan/phpstan-symfony и предоставить PHPStan путь к контейнеру Symfony, скомпилированному в XML. Обычно он хранится в каталоге `var/cache/dev`. В файл `phpstan.neon` (в корне проекта на уровне `composer.json`) необходимо добавить следующую конфигурацию:

```
parameters:
    symfony:
        container_xml_path: var/cache/dev/srcApp_KernelDevDebugContainer.xml
```

Пример конфигурации можно посмотреть в репозитории: [https://github.com/phpstan/phpstan-symfony](https://github.com/phpstan/phpstan-symfony)

Кроме того, для правильного анализа консольных команд - необходим консольный загрузчик. Это скрипт, который инициализирует Symfony Console и передает ее в PHPStan. Он может использовать его для определения типов аргументов или опций и т. Д.

У меня все скрипты для phpstan лежат в `project/phpstan/`

```
<?php declare(strict_types = 1);

use App\Kernel;
use Symfony\Bundle\FrameworkBundle\Console\Application;

require dirname(__DIR__) . '/../config/bootstrap.php';
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
return new Application($kernel);
```

И добавим в конфиг файл `phpstan.neon`

```
parameters:
    symfony:
        container_xml_path: var/cache/dev/srcApp_KernelDevDebugContainer.xml
        console_application_loader: phpstan/console-loader.php
```

С этой конфигурацией PHPStan может понимать Symfony. Он также проверяет, что вы не используете несуществующие (или приватные) сервисы из контейнера.

## Конфигурация PHPStan для PHPUnit

В предыдущей части мы успешно настроили PHPStan для проверки различных вещей в проектах Symfony. Тем не менее, все еще возможно улучшить конфигурацию.

Сейчас мы используем один и тот же файл конфигурации как для src, так и для тестов, но Symfony использует отдельный контейнер при работе в окружении разработки или тестирования. Это означает, что PHPStan будет сообщать об ошибках, таких как  `Service "Doctrine\ORM\EntityManagerInterface" is private.`  даже если тесты работают нормально.

Решение простое - используем отдельный файл конфигурации для src и для тестов. Мы можем оставить текущий phpstan.neon как есть, но мы должны создать специальную конфигурацию для тестов - phpstan-tests.neon. Это будет выглядеть очень похоже с единственным изменением в виде container\_xml\_path, который теперь указывает на контейнер, скомпилированный в `var/cache/test`:

```
parameters:
    symfony:
        container_xml_path: var/cache/test/srcApp_KernelTestDebugContainer.xml
        console_application_loader: phpstan/console-loader.php
```

Также нужно изменить секцию scripts в composer.json, чтобы запустить PHPStan дважды - сначала для каталога src, а затем для tests с другим файлом конфигурации. При использовании этой настройки вы все равно можете запустить composer phpstan, который, в свою очередь, запускает проверки для src и tests.

```
"phpstan": [
    "@phpstan-general",
    "@phpstan-tests"
],
"phpstan-general": "phpstan analyse -c phpstan.neon src --level 7 --no-progress",
"phpstan-tests": "phpstan analyse -c phpstan-tests.neon tests --level 7 --no-progress",
```

Я знаю, что конфигурация PHPStan дублируется, но это не имеет большого значения (вы не часто добавляете новые расширения).

Вы должны иметь в виду, что контейнер Symfony должен быть скомпилирован, прежде чем его можно будет использовать для анализа. По этому добавим вызов команды `cache:warmup` в скрипты:

```
"phpstan": [
    "@php bin/console cache:warmup --env=dev",
    "@php bin/console cache:warmup --env=test",
    "@phpstan-general",
    "@phpstan-tests"
],
```

Или вы можете поместить генерацию cache в отдельный скрипт, чтобы он не замедлял вас при повторном запуске PHPStan без изменений в контейнере (но вы должны убедиться, что контейнер перекомпилирован для тестовой среды после изменения).

Наконец, мы приступаем к настройке самого расширения PHPUnit. Нам нужно установить его через Composer:

```
composer require --dev phpstan/phpstan-phpunit
```

Конфигурация екстеншна будет подключена автоматически благодаря phpstan/extension-installer, который мы установили в начале. Итак, это все.

## PHPStan и DoctrineORM

Doctrine ORM contains even more magic things which can't be inferred just from the code itself. Repository and Entity Manager use object type in lot of places, so the PHPStan won't know which type is there and you would need to add lots of inline PHPDoc to make it work.

Doctrine ORM включает в себя еще больше магии, которая, не может быть определена кодом. EntityManager и Repository используют ваши типы объектов в разных местах, поэтому PHPStan не будет знать, какой тип есть, и вам нужно будет добавить множество встроенных PHPDoc, чтобы он работал. Или вы можете установить расширение `phpstan/phpstan-doctrine`, которое поможет PHPStan понять магию Doctrine.

`composer require --dev phpstan/phpstan-doctrine`

Как и в случае расширения Symfony, нужно добавить скрипт загрузчика, который вернет Entity Manager в PHPStan. Я обычно помещаю его в phpstan/doctrine-orm-bootstrap.php, и скрипт должен выглядеть так:

```
<?php declare(strict_types = 1);

use App\Kernel;

require dirname(__DIR__) . '/../config/bootstrap.php';
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();
return $kernel->getContainer()->get('doctrine')->getManager();
```

И добавим этот файл в нашу конфигурацию `phpstan.neon` и `phpstan-tests.neon`:

```
parameters:
    doctrine:
        objectManagerLoader: build/phpstan/doctrine-orm-bootstrap.php
```

При такой настройке PHPStan будет использовать EntityManager, чтобы проверять ваши DQL и Query Builders, что - потрясающе.

Следующая версия расширения PHPStan-Doctrine также будет поддерживать анализ аннотаций, чтобы определить, соответствует ли тип свойства типу столбца, правильно ли определены типы свойств для ассоциаций и т. Д.

## Строгие правила для PHPStan

Существует пакет phpstan/phpstan-strict-rules, в который добавляются дополнительные проверки, не включенные в ядро PHPStan. Вы можете установить его через Composer:

`composer require --dev phpstan/phpstan-strict-rules`

И, к сожалению, вы можете получить гораздо больше потенциальных проблем или сообщений о плохом коде :-)

## Заключение

Если вы настроите PHPStan в соответствии с этой статьей, это изменит вашу жизнь :-) (хотя бы немного).

В настоящее время я не могу представить разработку современных PHP-приложений без PHPStan, работающего на максимальном уровне с множеством проверок. Это помогает избежать многих проблем при разработке и рефакторинге приложений.

Перевод: [https://blog.martinhujer.cz/how-to-configure-phpstan-for-symfony-applications/](https://blog.martinhujer.cz/how-to-configure-phpstan-for-symfony-applications/)
