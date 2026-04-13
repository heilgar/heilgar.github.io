---
title: "2. CLI - shell приложения на Angular"
date: 2018-09-26
categories: 
  - "angular"
---

В этой части туториала, покажем как работать с Angular CLI (Shell).<!--more-->

## Устпановим Angular CLI

Перед установкой Angular CLI нужно [установить node.js](https://nodejs.org/uk/download/), а для установки самого CLI выполнить команду:

```
npm install -g @angular/cli
```

**Создание нового приложения:**

Для того что-бы продолжнить наш туториал по Angular нам нужно создать проект:

```
ng new angular-tour-of-heroes
```

CLI сгенерирует новый проект со стандартным приложением и файлами.

> Вы можете добавить pre-packed функционал к новому проекту используя команду ng add. Команда ng add преобразет проект, применяя схемы из указаного пакета (прим. Angular Material)
> 
> Angular Material предоставляет типичные шабоны/макеты (как вам угодно) приложений.

## Запустим приложение Angular 6:

Зайдите в директорию проекта и запустите:

```
ng serve --open
```

> Команда ng serve соберет приложение, и запистит сервер в режиме разработки, а это значит что будет наблюдать за исходными файлами и в случае их изменения пересоберет приложение за вас.
> 
> Флаг --open откроет приложение в браузере по адресу http://localhost:4200/.

После выполнения команды вы должны увидеть запущенное приложение в браузере.

## Компоненты Angular 6

Страница, которую вы увидете, представляет собой оболочку приложения которая управляеться компонентом AppComponent.

Компоненты являються фундаметальными блоками Angular  приложений. Они отображают данные на экране, прослушивают события пользователя и выполняют метотды на основании событий.

### Изменим название нашего проекта:

Откройте проект в своей любимой IDE и отправьтесь в папку src/app. Там надете реализацию оболочки AppComponent, распределенной по трем файлам:

1. app.component.ts - класс компонента написанный на [TypeScript](http://thewebland.net/development/javascript/typescript-video/).
2. app.component.html - файл шаблона HTML.
3. app.component.css - файл содержащий приватные стили компонента.

Откроем файл app.component.ts и изменими свойстово title на 'Tour of Heroes':

```
title = 'Tour of Heroes';

```

Для того что бы ободразить на экране наше название удалим все из файла app.component.html и вставим следующий код:

```
<h1>{{title}}</h1>
```

Двойные фигурные скобки являют собой синтаксис интерполяции Angular. Интерполяция представляет значение свойства title внтри тега заголовка HTML.

После внесения изменений браузер обновит и отобразит новый заголовок приложения.

**Добавим немного стилей:**

Что бы наше приложение выглядело одинаково на всех представлениях/екрана CLI сгенерировал для нас пустой файл styles.css. В этот файл мы будем добавалять наши стили. Добавим их на шаге code review

**Code review урока**

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
}
```

```
<h1>{{title}}</h1>
```

```
/* Application-wide Styles */
h1 {
  color: #369;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 250%;
}
h2, h3 {
  color: #444;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
}
body {
  margin: 2em;
}
body, input[text], button {
  color: #888;
  font-family: Cambria, Georgia;
}
/* everywhere else */
* {
  font-family: Arial, Helvetica, sans-serif;
}
```

Что мы узнали (создали):

- Создали первоначальную структуру проекта используя CLI.
- Научились отображать данные из компонента Angular 6.
- Использовали интерполяция (двойные фигурные скобки) для отображения title.
