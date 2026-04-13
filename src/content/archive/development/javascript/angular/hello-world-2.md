---
title: "Angular 2 - Hello World"
date: 2017-01-22
categories: 
  - "angular"
---

**Описание** В предыдущей статье мы рассмотрели как устанавливать окружение для Angular 2. В єтой части создадим классическое приложение под названием "Hello, Wolrd".

В коде ниже описано как вывести на екран простой текст с помощью Angular 2:

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
      System.import('app/hello_world_main')
            .then(null, console.error.bind(console));
    </script>
  </head>
<body>
   <my-app>Loading...</my-app>
</body>
</html>
```

- Код включает в себя следующее: Вы можете настраивать index.html используя typescript. SystemJS транслирует код TypeScript на JS перед запуском приложения с помощью опции _transpiler_.
- Если не транслировать код на JavaScript, перез запуском приложения вы можете увидеть предупреждения компилятора и ошибки.
- TypeScript генерирует метаданные для каждого отдельно взятого класса когда опция _emitDecoratorMetadata_ включена. Если не установить эту опцию будет генерироваться большой объем неиспользуемых метаданных, которые влияют на размер файла и время выполнения скрипта.
- Angular 2 использует пакеты из app в которой файлы имеют расширение **.ts**
- Следующим будет загружатся главный (main) компонет. Если компонент не найден в консоль будет выведена ошибка.
- Когда Angular вызывает _bootstrap_ функцию в main.ts и читает метаданные компонента, находит 'app' селектор и расположение тега, а после запускает приложение.

Для запуска кода понадобиться TypeScript файл который находится в _app_ директории.

**hello\_world\_main.ts**

```
import {bootstrap} from "angular2/platform/browser"
import {MyHelloWorldClass} from "./hello_world_app.component"

bootstrap(MyHelloWorldClass);
```

Теперь создадим компонент на TypeScript:

**hello\_world\_app.component.ts**

```
import {Component, View} from "angular2/core";

@Component({
   selector: 'my-app'
})

@View({
  template: '<h2>Hello World !!</h2>'
})

export class MyHelloWorldClass {

}
```

- Декоратор @Component использует конфигурацию объекта что бы создать компонент.
- Селектор создает инстанс компонента где находит <my-app> тег
- @View создержит шаблон по которому собиратеся представление
- export определяет доступность компонента вне файла.

Давайте выполним следующие шаги, что бы увидеть, как приведенный выше код работат:

- Сохраните HTML код как index.html который мы создали в главе [Окружение](http://thewebland.net/development/javascript/angular-2/environment/).
- Откройте терминал и запустите
    
    ```
    npm start
    ```
    

Или используйте другой путь:

- Сохраните HTML код как angular2\_hello\_world.html в корне вашего сервера
- Откройте файл на вашем хосте с браузера. (http://localhost/angular\_hello\_world.html)
