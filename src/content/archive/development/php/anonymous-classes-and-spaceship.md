---
title: "Использование анонимных классов и  ('Spaceship') оператора в PHP"
date: 2017-11-05
categories: 
  - "php"
---

Поддержка анонимнынх классов добавлена в  [PHP 7.](https://secure.php.net/manual/en/language.oop5.anonymous.php)

Некоторые моменты об анонимных классах в PHP:

Синтаксис почти идентичен именованому классу, это просто класс без имени. Вот почему он называется Анонимный класс.<!--more-->

Что вы можете сделать, используя анонимные классы:

- можно назначить его переменной
- может вернуться из функции
- может передаваться как аргумент функции
- почти как обычный класс - может расширять класс, может реализовывать интерфейсы, использовать трейты
- **не может** быть сериализован

Более подробный обзор анонимных классов см. в [документации](https://secure.php.net/manual/en/language.oop5.anonymous.php).

Случаи использования анонимных классов в PHP:

- создание простых одноразовых объектов
- в модульном тестировании

Подробнее описано в [RFC.](https://wiki.php.net/rfc/anonymous_classes)

Достаточно воды, давайте перейдем к сценарию реального использования.

У нас есть ресурс API, который возвращает пользователей. Наша задача состоит в том, чтобы напечатать имена пользователей в порядке убывания количества фоловеров. (т.е. отсортировать по количеству фоловеров)

Ответ от json выглядит так (с большим количеством объектов):

```
[
 {
        "text": "Voluptate aliqua consectetur reprehenderit fugiat cillum labore id dolore cillum sint ad tempor commodo. Veniam aute duis Lorem ea nisi exercitation elit officia. Cillum esse ea dolore ullamco anim aliquip est.\r\n", 
        "created_at": "2014-02-25T09:20:21 -06:-30", 
        "id": "59821540f0d11ec0019f907e", 
        "user": {
            "followers_count": 893747, 
            "name": "Nunez", 
            "id": "89cc4635-6404-40b9-b15b-82e3514ab4c8"
        }
    }, 
    {
        "text": "Cupidatat fugiat sunt reprehenderit incididunt aute adipisicing magna cupidatat nulla consectetur anim magna. Id occaecat incididunt in nostrud amet. Aute dolore proident occaecat elit consectetur. Exercitation mollit cillum dolore culpa ea ipsum tempor est. Magna ipsum ex amet elit excepteur.\r\n", 
        "created_at": "2015-08-21T08:26:19 -06:-30", 
        "id": "59821540c8e9abd4618e9034", 
        "user": {
            "followers_count": 311461, 
            "name": "Chang", 
            "id": "f0e283d0-bfd6-4c06-89f9-a4c71b7c5f17"
        }
    }
]
```

теперь давайте реализуем решение

```
<?php

$json = json_decode(file_get_contents("https://gist.githubusercontent.com/anonymous/65a02c91a2a2ea087198a9be74e7dbc4/raw/45359731cd00119c4f761ff813e6b76a4c8e22bf/users.json"), true);

$topUsers = new class() extends \SplHeap
{
    protected function compare($value1, $value2)
    {
        return (int)$value1['user']['followers_count'] <=> (int)$value2['user']['followers_count'];
    }
};

foreach ($json as $data) {
    $topUsers->insert($data);
}

echo "User"." - "."Followers".PHP_EOL;
foreach ($topUsers as $user) {
    echo $user['user']['name'].' - '.$user['user']['followers_count'].PHP_EOL;
}

```

O/P

```
User - Followers
Lorena - 1441740
Mcfadden - 1432646
Angel - 1416512
Jana - 1399750
Laurie - 1373911
Louisa - 1237079
Avila - 1228972
Hoffman - 1151910
Robert - 1138613
Patty - 1095499
Sylvia - 1055464
Bobbi - 1053050
Fitzgerald - 1038147
Morrow - 998797
Nunez - 893747
Stanley - 810207
Scott - 790395
Natalie - 761451
Hurley - 709661
Lang - 575764
Mccullough - 550085
Matilda - 481552
Santiago - 464343
Fuller - 442185
Callahan - 433387
Morgan - 403480
Clemons - 351374
Boyle - 351141
Leona - 323783
Chang - 311461
Madge - 289641
Tucker - 274473
Grace - 229155
Aisha - 211126
Knight - 207963
Walsh - 142328
Hollie - 120530
Reynolds - 89821
Clements - 78024
Acevedo - 47894
```
