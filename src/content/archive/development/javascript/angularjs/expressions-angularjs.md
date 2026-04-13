---
title: "Выражения в AngularJS"
date: 2016-03-28
categories: 
  - "angularjs"
---

Выражения используются для связывания данных с HTML кодом. Выражения пишутся внутри двойных фигурных кавычек {{ выражение }}. Поведение выражений такое же как и у дерективы ng-bind. Выражения используют нативный javascript код для вывода данных в том месте где их выводят.<!--more-->

## Арифметические операции AngularJS

```
<p>Expense on Books : {{cost * quantity}} Rs</p>
```

AngularJS поддерживает все арифметические операции нативного javascript: [https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Arithmetic\_Operators](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators)

## Работа со строками в выражениях AngularJS

```
<p>Hello {{student.firstname + " " + student.lastname}}!</p>
```

## Объекты

```
<p>Roll No: {{student.rollno}}</p>
```

## Массивы

```
<p>Marks(Math): {{marks[3]}}</p>
```

**Тестовый пример:**

```
<html>
   
   <head>
      <title>AngularJS Expressions</title>
   </head>
   
   <body>
      <h1>Sample Application</h1>
      
      <div ng-app = "" ng-init = "quantity = 1;cost = 30; student = {firstname:'Mahesh',lastname:'Parashar',rollno:101};marks = [80,90,75,73,60]">
         <p>Hello {{student.firstname + " " + student.lastname}}!</p>
         <p>Expense on Books : {{cost * quantity}} Rs</p>
         <p>Roll No: {{student.rollno}}</p>
         <p>Marks(Math): {{marks[3]}}</p>
      </div>
      
      <script src = "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
      
   </body>
</html>
```

**Вывод в браузер:**


