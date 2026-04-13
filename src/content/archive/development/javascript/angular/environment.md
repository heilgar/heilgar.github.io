---
title: "Angular 2 - Окружение"
date: 2017-01-22
categories: 
  - "angular"
---

В этой части мы рассмотрим окружение разработки Angular 2

- Angular 2 использует TypeScript который является основным языком для разработки приложений на Angular 2
- TypeScript является надстройкой над JavaScript

Пошаговая инструкция установки окружения разработки Angular 2:

**Шаг 1**: Открываем консоль и cозадем папку проекта на локальном диске:

```
mkdir angular2-demo
cd angular2-demo
```

**Шаг 2**: Создаем конфигурационные файлы. Вам нужно создать **tsconfig.json** который служит для конфигурации компиляции TypeScript.

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "system",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  },
  "exclude": [
    "node_modules",
    "typings/main",
    "typings/main.d.ts"
  ]
}
```

**Шаг 3**: Создайте **typings.json**

```
{
  "globalDependencies": {
    "core-js": "registry:dt/core-js#0.0.0+20160602141332",
    "jasmine": "registry:dt/jasmine#2.2.0+20160621224255",
    "node": "registry:dt/node#6.0.0+20160621231320"
  }
}
```

Большое количество библиотек JavaScript расширяет среду функциями и синтаксисом, которые изначально не включены в компилятор TypeScript. typings.json файл используется для определения файлов приложения.

По коду выше у нас 3 файла:

- **core-js**: возможности ES2015/ES6 в браузерах с поддержкой только ES5
- **jasmine**: Jasmine test framework
- **node**: Используется для кода который ссылается на объекты из окружения nodejs

**Шаг 4**: Добавляем **package.json**

```
{
  "name": "angular2-demo",
  "version": "1.0.0",
  "scripts": {
    "start": "concurrent \"npm run tsc:w\" \"npm run lite\" ",
    "tsc": "tsc",
    "tsc:w": "tsc -w",
    "lite": "lite-server",
    "typings": "typings",
    "postinstall": "typings install"
  },
  "license": "ISC",
  "dependencies": {
    "angular2": "2.0.0-beta.7",
    "systemjs": "0.19.22",
    "es6-promise": "^3.0.2",
    "es6-shim": "^0.33.3",
    "reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.2",
    "zone.js": "0.5.15"
  },
  "devDependencies": {
    "concurrently": "^2.0.0",
    "lite-server": "^2.1.0",
    "typescript": "^1.7.5",
    "typings":"^0.6.8"
  }
}
```

package.json содержит необходимые нашему приложению библиотеки. Используется как файл конфигурации NPM.

- [https://www.npmjs.com/](https://www.npmjs.com/)
- [https://nodejs.org/uk/download/](https://nodejs.org/uk/download/)

**Шаг 5**: Устанавливаем необходимые пакеты

```
npm install
```

> Сообщения об ошибках при установке пакетов можно проигнорировать.

## Создание первого компонента на Angular 2

> Компонент - фундаментальная концепция Angular 2. Компонент это клас который контролирует шаблон - часть веб страницы которая взаимодействует с пользователем. Компоненты необходимы для построения приложений на Angular 2.

**Шаг 6:** Создаем в паке нашего проекта папку _app_ куда будем помещать наши компоненты:

```
mkdir app
cd app
```

**Шаг 7:**  Файлы которые вы будете создавать должны быть сохранены с расширением **.ts.** Создадим файл **environment\_app.component.ts**

```
import {Component, View} from "angular2/core";

@Component({
   selector: 'my-app'
})

@View({
  template: '<h2>My First Angular 2 App</h2>'
})

export class AppComponent {

}
```

- Код служит для импорта компонента и шаблона с пакета angular2/core.
- Деректива _@Component_ в Angular 2 - декоратор который позволяет асоциировать данные с классом компонента.
- _my-app_ \- служит как HTML тег для внедрения компонента на страницу.
- _@View_ содержит шаблон который определяет как будет рендерится приложение
- _export_ указывает на то что этот компонент будет доступен вне файла.

**Шаг 8:** Затем, создайте файл **environment\_main.ts**:

```
import {bootstrap} from "angular2/platform/browser"
import {AppComponent} from "./environment_app.component"

bootstrap(AppComponent);
```

- Файл **environment\_main.ts** служит для загрузки компонентов.
- Для запуска приложения нам нужно импортировать оба корневых компонента приложения.
- После импорта компонентов, будет вызван наш компонент.

**Шаг 9:** Создайте index.html файл в папке проекта _angular2-demo/:_

```
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.33.3/es6-shim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.20/system-polyfills.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.6/angular2-polyfills.js"></script>
    <script src="https://code.angularjs.org/tools/system.js"></script>
    <script src="https://code.angularjs.org/tools/typescript.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.6/Rx.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.6/angular2.dev.js"></script>
    <script>
      System.config({
        transpiler: 'typescript',
        typescriptOptions: { emitDecoratorMetadata: true },
        packages: {'app': {defaultExtension: 'ts'}},
        map: { 'app': './angular2/src/app' }
      });
      System.import('app/environment_main')
            .then(null, console.error.bind(console));
    </script>
  </head>
<body>
   <my-app>Loading...</my-app>
</body>
</html>
```

Angular 2 запустит приложение в браузере с нашим компонентом и поместит его в определенном нами месте в index.html

**Шаг 10:** Для запуска приложения нам нужно выполнить команду

```
npm start
```

Команда запускает два паралельных процеса и прослушивает их:

- TypeScript компилятор в состоянии "watch mode"
- Статический серверв для загрузки index.html в браузер и обновление браузера при изменении файлов.

После нескольких мгновений откроется вкладка браузера.
