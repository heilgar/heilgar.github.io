---
title: "Установка PHPUnit"
date: 2018-09-18
categories: 
  - "phpunit"
---

## Требования

PHPUnit 7.3 требует PHP 7.1; рекомендуется использовать последнюю версию PHP.

PHPUnit требует расширения [dom](http://php.net/manual/en/dom.setup.php) и [json](http://php.net/manual/en/json.installation.php), которые обычно установлены по умолчанию.

PHPUnit также требует расширения [pcre](http://php.net/manual/en/pcre.installation.php), [reflection](http://php.net/manual/en/reflection.installation.php) и [spl](http://php.net/manual/en/spl.installation.php). Это стандартные расширения включены по умолчанию и не могут быть выключены без исправления системы сборки PHP и/или источников C.

Для функции отчета о покрытии кода требуются расширения [Xdebug](https://xdebug.org/) (2.5.0 или новее) и [tokenizer](http://php.net/manual/en/tokenizer.installation.php). Для генерации отчетов XML требуется расширение [xmlwriter](http://php.net/manual/en/xmlwriter.installation.php).

<!--more-->

## PHP Архив (PHAR)

Самый простой способ установить PHPUnit - загрузить [PHP Archive (PHAR)](http://php.net/phar), в котором есть все необходимые (а также некоторые необязательные) зависимости PHPUnit в одном файле.

Расширение [phar](http://php.net/manual/en/phar.installation.php) требуется для использования PHP Archives (PHAR).

Если расширение [Suhosin](http://suhosin.org/) включено, вам нужно разрешить выполнение PHAR в php.ini:

```
suhosin.executor.include.whitelist = phar
```

Чтобы глобально установить PHAR:

```
$  wget https://phar.phpunit.de/phpunit-|version|.phar
$  chmod +x phpunit-|version|.phar
$  sudo mv phpunit-|version|.phar /usr/local/bin/phpunit
$  phpunit --version
PHPUnit x.y.z by Sebastian Bergmann and contributors.
```

Вы также можете использовать загруженный файл PHAR:

```
$  wget https://phar.phpunit.de/phpunit-|version|.phar
$  php phpunit-|version|.phar --version
PHPUnit x.y.z by Sebastian Bergmann and contributors.
```

### **Windows**

Глобальная установка PHAR включает ту же процедуру, что и [ручная установка Composer в Windows](https://getcomposer.org/doc/00-intro.md#installation-windows):

1. Создать каталог для бинарников PHP; например, C: \\bin
2. Добавить: C:/bin в переменную среды PATH ([справка](https://stackoverflow.com/questions/6318156/adding-python-path-on-windows-7))
3. Загрузите https://phar.phpunit.de/phpunit-|version|.phar и сохраните файл как C:\\bin\\phpunit.phar
4. Откройте командную строку (например, нажмите Windows + R >> cm >> ENTER)
5. Создайте пакетный скрипт (результат: C: \\bin\\phpunit.cmd):

```
C:\Users\username>  cd C:\bin
C:\bin>  echo @php "%~dp0phpunit.phar" %* > phpunit.cmd
C:\bin>  exit
```

6. Откройте новую командную строку и убедитесь, что вы можете выполнить PHPUnit с любого пути:

```
C:\Users\username>  phpunit --version
PHPUnit x.y.z by Sebastian Bergmann and contributors.
```

Для сред оболочки Cygwin и / или MingW32 (например, TortoiseGit) вы можете пропустить шаг 5. выше, просто сохраните файл как phpunit (без расширения .phar) и сделайте его исполняемым с помощью chmod 775 phpunit.

 

### **Проверка версии PHPUnit**

Весь официальный код, распространяется проектом PHPUnit, подписывается менеджером выпуска. Подписи PGP и хэши SHA1 доступны для проверки на phar.phpunit.de.

В следующем примере описано, как работает проверка версии. Начнем с загрузки phpunit.phar, а также его отдельной PGP-подписи phpunit.phar.asc:

```
wget https://phar.phpunit.de/phpunit.phar
wget https://phar.phpunit.de/phpunit.phar.asc
```

Мы хотим проверить PHP-архив PHPUnit (phpunit.phar) на его выделенную подпись (phpunit.phar.asc):

```
gpg phpunit.phar.asc
gpg: Signature made Sat 19 Jul 2014 01:28:02 PM CEST using RSA key ID 6372C20A
gpg: Can't check signature: public key not found
```

У нас нет открытого ключа менеджера релиза (6372C20A) в нашей локальной системе. Чтобы продолжить проверку, нам нужно получить открытый ключ менеджера релиза с сервера ключей. Одним из таких серверов является pgp.uni-mainz.de. Серверы с открытым ключом связаны между собой, поэтому вы можете подключиться к любому серверу ключей.

```
gpg --keyserver pgp.uni-mainz.de --recv-keys 0x4AA394086372C20A
gpg: requesting key 6372C20A from hkp server pgp.uni-mainz.de
gpg: key 6372C20A: public key "Sebastian Bergmann <sb@sebastian-bergmann.de>" imported
gpg: Total number processed: 1
gpg:               imported: 1  (RSA: 1)
```

Теперь мы получили открытый ключ для лица, известного как «Себастьян Бергманн <sb@sebastian-bergmann.de>». Однако у нас нет способа проверить, что этот ключ был создан человеком, известным как Себастьян Бергманн. Но давайте попробуем снова проверить подпись выпуска.

```
gpg phpunit.phar.asc
gpg: Signature made Sat 19 Jul 2014 01:28:02 PM CEST using RSA key ID 6372C20A
gpg: Good signature from "Sebastian Bergmann <sb@sebastian-bergmann.de>"
gpg:                 aka "Sebastian Bergmann <sebastian@php.net>"
gpg:                 aka "Sebastian Bergmann <sebastian@thephp.cc>"
gpg:                 aka "Sebastian Bergmann <sebastian@phpunit.de>"
gpg:                 aka "Sebastian Bergmann <sebastian.bergmann@thephp.cc>"
gpg:                 aka "[jpeg image of size 40635]"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: D840 6D0D 8294 7747 2937  7831 4AA3 9408 6372 C20A
```

На данный момент подпись хорошая, но мы не доверяем этому ключу. Хорошая подпись означает, что файл не был изменен. Однако из-за характера криптографии с открытым ключом вам необходимо дополнительно проверить, что ключ 6372C20A был создан настоящим Себастьяном Бергманном.

Любой злоумышленник может создать открытый ключ и загрузить его на серверы открытого ключа. Затем они могут создать вредоносный релиз, подписанный этим поддельным ключом. Затем, если вы попытаетесь проверить подпись этого релиза, она будет верной, потому что ключ не является «реальным» ключом. Поэтому вам необходимо проверить подлинность этого ключа. Однако проверка подлинности открытого ключа выходит за рамки этой документации.

Может быть разумным создать сценарий оболочки для управления установкой PHPUnit, которая проверяет подпись GnuPG перед запуском набора тестов. Например:

```
#!/usr/bin/env bash
clean=1 # Delete phpunit.phar after the tests are complete?
aftercmd="php phpunit.phar --bootstrap bootstrap.php src/tests"
gpg --fingerprint D8406D0D82947747293778314AA394086372C20A
if [ $? -ne 0 ]; then
   echo -e "\033[33mDownloading PGP Public Key...\033[0m"
   gpg --recv-keys D8406D0D82947747293778314AA394086372C20A
   # Sebastian Bergmann <sb@sebastian-bergmann.de>
   gpg --fingerprint D8406D0D82947747293778314AA394086372C20A
   if [ $? -ne 0 ]; then
       echo -e "\033[31mCould not download PGP public key for verification\033[0m"
       exit
   fi
fi

if [ "$clean" -eq 1 ]; then
   # Let's clean them up, if they exist
   if [ -f phpunit.phar ]; then
       rm -f phpunit.phar
   fi
   if [ -f phpunit.phar.asc ]; then
       rm -f phpunit.phar.asc
   fi
fi

# Let's grab the latest release and its signature
if [ ! -f phpunit.phar ]; then
   wget https://phar.phpunit.de/phpunit.phar
fi
if [ ! -f phpunit.phar.asc ]; then
   wget https://phar.phpunit.de/phpunit.phar.asc
fi

# Verify before running
gpg --verify phpunit.phar.asc phpunit.phar
if [ $? -eq 0 ]; then
   echo
   echo -e "\033[33mBegin Unit Testing\033[0m"
   # Run the testing suite
   `$after_cmd`
   # Cleanup
   if [ "$clean" -eq 1 ]; then
       echo -e "\033[32mCleaning Up!\033[0m"
       rm -f phpunit.phar
       rm -f phpunit.phar.asc
   fi
else
   echo
   chmod -x phpunit.phar
   mv phpunit.phar /tmp/bad-phpunit.phar
   mv phpunit.phar.asc /tmp/bad-phpunit.phar.asc
   echo -e "\033[31mSignature did not match! PHPUnit has been moved to /tmp/bad-phpunit.phar\033[0m"
   exit 1
fi
```

## Composer

Просто добавьте зависимость (development) от phpunit / phpunit в файл composer.json вашего проекта, если вы используете Composer для управления зависимостями вашего проекта:

```
composer require --dev phpunit/phpunit ^|version|
```

## Дополнительные пакеты

Доступны следующие дополнительные пакеты:

**PHP\_Invoker**

Класс утилиты для вызова callables с таймаутом. Этот пакет необходим для обеспечения соблюдения тайм-аутов тестирования в строгом режиме.

Этот пакет включен в дистрибутив PHAR для PHPUnit. Его можно установить через Composer, используя следующую команду:

```
composer require --dev phpunit/php-invoker

```

**DbUnit**

Порт DbUnit для PHP / PHPUnit для поддержки тестирования взаимодействия с базами данных.

Этот пакет не включен в дистрибутив PHAR для PHPUnit. Его можно установить через Composer, используя следующую команду:

```
composer require --dev phpunit/dbunit
```

 

[https://phpunit.readthedocs.io/ru/latest/installation.html](https://phpunit.readthedocs.io/ru/latest/installation.html)
