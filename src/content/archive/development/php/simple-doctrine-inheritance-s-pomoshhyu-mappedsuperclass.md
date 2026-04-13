---
title: "Простое doctrine наследование с помощью MappedSuperclass"
date: 2018-10-05
categories: 
  - "php"
---

Стала тут передо мной задача, расширить некий функционал.

> Приведенное наследование, может использоваться и в друхих ситуациях. Я же, просто описываю свой конкретный кейс.
> 
> _Все есть "псевдо"-код_

**Дано**: [REST](https://ru.wikipedia.org/wiki/REST) сервис который обрабатывает входящие данные. т.е: [POST](https://ru.wikipedia.org/wiki/POST_\(HTTP\)) запрос с огомным payload.

**Обработка:** Реализован патерн [Chain Of Responsibility](https://designpatternsphp.readthedocs.io/ru/latest/Behavioral/ChainOfResponsibilities/README.html)  в котором, собственно и происходит вся обработка.

Из входящего payload, цепь строит некую структуру связанных между собой объектов, обрабатывает их и пишет в базу.

**Задача:** Добавить дополнительные данные внутри цепи к вложенному объекту и отправить в другой сервис (не записывая его в базу - _(почему? - это уже совсем другая история)_).

Пример нискольких елементов цепи

```
<?php

namespase ApiBundle\Service\Processor;

use AppBundle\Entity\Data;

class DataProcessor extends AbstractProcessor { 

    public function process($requestData, $chainData) 
    { 
         $data = new Data();

         ...

         $this->em->persist();

         return $chainData;
    }
}
```

```
<?php

namespase ApiBundle\Service\Processor;

use AppBundle\Entity\Data;

class DummyRelation extends AbstractProcessor { 

    public function process($requestData, $chainData) 
    { 
         $data = new DummyRelation();

         ...

         $this->em->persist();

         return $chainData;
    }
}
```

В AbstractProcessor, также лежит логика, в конечном итоге, вызывая $this->em->flush();

**Почему бы не написать обработку после выполнения цепи? -** Основная причина это сложная структура данных, и если использовать, например, пост процессор, алгоритм обработки усложняеться на 2_n_  раз. -

> 2_n_ \- ничем не обоснованное видение сложности автора. :)  А если, в случае с пост процессором, всю структуру (дерево) нужно обойти несколько раз.
> 
> Был выбран более эфективный, по мнению автора, алгоритм, который обрабатывает нужные данные, в нужном месте цепи, без обхода всех объектов (дерева).

**Цель**:

- Расширить класс сущности без создания таблицы в базе данных.
- Не захламлять класс entity полями которые не относятся к таблице.
- Использовать наследника для записи в базу, что бы не использовать всякого рода датамаперы.

Т.e. (моя структура (псевдо))

```
src/
- ApiBundle
-- Model
--- DataResponse.php 
--- DataResponse
---- SomeDummyRelationResponse.php
---- DummyRelationResponse.php
-- Service
--- DataProcessor.php
--- AbstractDataProcessor.php
--- DummyRelationProcessor.php
- AppBundle
-- Entity
--- Data.php
--- Data
---- SomeDummyRelation.php
---- DummyRelationResponse.php
```

Давайте посмотрим на пример кода (_на самом деле псевдокода_) сущности:

```
<?php

namespace AppBundle\Entity;

/**
* @ORM\Entity()
*/
class Data {

   /**
    * @ORM\OneToMany(targetEntity="AppBundle\Entity\Data\SomeDummyRelation")
    */
    private $someDummyRelation;

    /**
    * @ORM\OneToMany(targetEntity="AppBundle\Entity\Data\DummyRelation")
    */
    private $dummyRelation;

    ... // getters / setsrs
}
```

В данном случае нам не важно что лежит в классах связи, их описывать я не буду (хотя может и стоило, напишите в комментариях).

> Первоначально я просто отнаследовал модель от ентити, но из этого ничего не вышло и начались валится ероры.
> 
> ```
> [Doctrine\ORM\Mapping\MappingException]
>   Class "Bla\Bla" sub class of "Blah\Blah" is not a valid entity or mapped super class.
> ```

Doctrine говорит нам, что есть класс, и он расширяет сущность. Сделайте что-нибудь, чтобы решить эту проблему, потому что я не знаю, как использовать этот класс как сущность или что-то другое? Для решения этой проблемы есть некоторое решение.

Для того что бы расширить класс сущности и не создавать новую таблицу в своей базе, я буду использовать MappedSuperClass. Посмотрим на примере:

```
<?php

namespace ApiBundle\Model;

use AppBundle\Entity\Data;

/**
*@ORM\MappedSuperclass
*/
class DataResponse extends Data { 

    /**
    * @Serializer\Type("ApiBundle\Model\Data\SomeDummyRelation")
    */
    private $someDummyRelation;

    /**
    * @Serializer\Type("ApiBundle\Model\Data\DummyRelation")
    */
    private $dummyRelation;   
}
```

```
<?php

namespace ApiBundle\Model\Data;

use AppBundle\Entity\Data\SomeDummyRelation;

/**
*@ORM\MappedSuperclass
*/
class SomyDummyRelationResponse extends SomeDummyRelation { 

   ...
}
```

```
<?php

namespace ApiBundle\Model\Data;

use AppBundle\Entity\Data\DummyRelation;

/**
*@ORM\MappedSuperclass
*/
class DummyRelationResponse extends DummyRelation { 

   ...
}
```

Обновил свои процессоры:

```
<?php

namespase ApiBundle\Service\Processor;

use ApiBundle\Model\DataResponse;

class DataProcessor extends AbstractProcessor { 

    public function process($requestData, $chainData) 
    { 
         $data = new DataResponse();

         ...

         $this->em->persist();

         return $chainData;
    }
}
```

```
<?php

namespase ApiBundle\Service\Processor;

use ApiBundle\Model\Data\DummyRelationResponse;

class DummyRelation extends AbstractProcessor { 

    public function process($requestData, $chainData) 
    { 
         $data = new DummyRelationResponse();

         ...

         $this->em->persist();

         return $chainData;
    }
}

```

Думал, заживем ...

Появилась новая проблема. Я не могу записать в базу - что эсть плохо. А как мы помним в цепи вызываеться $this->em->persist() и в конце $this->em->flush().

> MappedSuperclass - не может быть сущностью, он не зависит от запросов и постоянных отношений, определяемых MappedSuperclass, должены быть однонаправленными. Это означает, что ассоциации «один-ко-многим» вообще невозможны для MappedSuperclass. Кроме того, ассоциации Many-to-Many возможны только в том случае, если MappedSuperclass используется только в одном объекте на данный момент. Для дальнейшей поддержки наследования необходимо использовать одиночные или объединенные функции наследования таблиц.
> 
> [https://www.doctrine-project.org/projects/doctrine-orm/en/2.6/reference/inheritance-mapping.html](https://www.doctrine-project.org/projects/doctrine-orm/en/2.6/reference/inheritance-mapping.html)

Но все же выход из ситуации нашелся, так как я не хотел использовать пост обработку.

Вспомнил я что у Doctrine есть чудный [ResolveTargetEntityListener](https://symfony.com/doc/current/doctrine/resolve_target_entity.html) который позволяет мапить Интерфейс модели на одну сущность.

В конечном итоге, я добавил немного в конфиг:

```
doctrine:
    # ... 
    orm: 
    # ... 
    resolve_target_entities:
        ApiBundle\Model\DataResponse: AppBundle\Entity\Data
        ApiBundle\Model\DataResponse\SomeDummyRelationResponse: AppBundle\Entity\Data\SomeDummyRelation
        ApiBundle\Modle\DataResponse\DummyRelationResponse: AppBundle\Entity\Data\DummyRelation
```

> С помощью ResolveTargetEntityListener вы можете разделить свои пакеты, сохраняя их структуру неизменной, но все же имея возможность определять отношения между различными объектами. Используя этот метод, ваши пакеты станет легче поддерживать.
> 
> [https://symfony.com/doc/current/doctrine/resolve\_target\_entity.html](https://symfony.com/doc/current/doctrine/resolve_target_entity.html)

 

 

Описаный подход, не претендует быть "истинно правильным". Если у вас есть возражения или пожелания, их можно оставить в комментариях.

 

Ну и на последок, как многие ютюб-блогеры - "Лайки ставим, на канал подписываемся, в коменты пишем, и т.д. и т.п"

 

P.S. Спасибо за потраченное время. Если есть мысли о том что может пойти не так в предложенной схеме, велкам в комменты.
