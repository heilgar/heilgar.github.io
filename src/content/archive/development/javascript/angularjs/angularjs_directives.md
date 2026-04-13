---
title: "AngularJS основные директивы"
date: 2016-03-23
categories: 
  - "angularjs"
---

AngularJS директивы расширяют набор HTML атрибутов. Это специальные атрибуты начинающиеся с префикса “ng-“. Мы собираемся описать следующие из них –<!--more-->

- ng-app – Определяет корневой элемент приложения.
- ng-init – Определяет начальные значения для приложения.
- ng-model –Связывает значение управления HTML для данных приложения.
- ng-repeat – Определяет шаблон для каждого типа данных в коллекции.

## **ng-app директива**

**ng-app** является точной входа в AngulaJS приложение. Она определяет корневой элемент (в котором будет происходить вся работа) нашего приложения. Она автоматически инициализирует приложение когда веб страница будет загружена. Так же она используется для загрузки различных AngularJS модулей в приложение. В примере, мы определим корневой элемент для AngularJS приложения используя ng-app атрибут на <div> элементе.

```
<div ng-app = "">
   ...
</div>
```

 

## **ng-init директива**

**ng-init** инициализирует данные нашего приложения. Директива используется, чтобы загрузить данные в приложение. В примере, мы инициализируем массив стран. Мы используем JSON синтаксис для определения массива стран.

```
<div ng-app = "" ng-init = "countries = [{locale:'en-US',name:'United States'}, {locale:'en-GB',name:'United Kingdom'}, {locale:'en-FR',name:'France'}]">
   ...
</div>
```

 

## **ng-model директива**

Определяет модель/переменную для использования в приложении.  В следующем примере мы определим модель с названием “name”.

```
<div ng-app = "">
   ...
   <p>Enter your Name: <input type = "text" ng-model = "name"></p>
</div>
```

 

## **ng-repeat директива**

**ng-repeat** повторяет html элементы для каждого элемента коллекции. В примере, мы рассмотрим вывод массива стран в DOM.

```
<div ng-app = "">
   ...
   <p>List of Countries with locale:</p>
   
   <ol>
      <li ng-repeat = "country in countries">
         {{ 'Country: ' + country.name + ', Locale: ' + country.locale }}
      </li>
   </ol>
   
</div>
```

## **Пример:**

```
<html>
   
   <head>
      <title>AngularJS Directives</title>
   </head>
   
   <body>
      <h1>Sample Application</h1>
      
      <div ng-app = "" ng-init = "countries = [{locale:'en-US',name:'United States'}, {locale:'en-GB',name:'United Kingdom'}, {locale:'en-FR',name:'France'}]"> 
         <p>Enter your Name: <input type = "text" ng-model = "name"></p>
         <p>Hello <span ng-bind = "name"></span>!</p>
         <p>List of Countries with locale:</p>
      
         <ol>
            <li ng-repeat = "country in countries">
               {{ 'Country: ' + country.name + ', Locale: ' + country.locale }}
            </li>
         </ol>
      </div>
      
      <script src = "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
      
   </body>
</html>
```

Что получилось:



Полный список [деректив AngularJS](http://35.156.110.60/angularjs-tutorial/angularjs-references/): [http://35.156.110.60/angularjs-tutorial/angularjs-references/](http://35.156.110.60/angularjs-tutorial/angularjs-references/)
