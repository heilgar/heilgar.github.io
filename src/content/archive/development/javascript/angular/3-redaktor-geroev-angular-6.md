---
title: "3. «Редактор Героев» - Angular 6"
date: 2018-09-27
categories: 
  - "angular"
---

Наше приложение теперь имеет название. Теперь мы создадим новый компонент для отображения информации о героях и поместим этот компонент в оболочку приложения.<!--more-->

Используя CLI запустим команду:

```
ng generate component heroes
```

CLI создаст новую папку  src/app/heroes/ и сгенерирует 3 файла HeroesComponent.

```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

Мы всегда импортируем Component из библиотеки agngular/core и декорируем класс с помощью @Component.

@Component - функция декоратока которая определяет метаданные компонента в Angular.

CLI сгенерировале три свойства метаданных:

- selector - CSS селектор компонента
- templateUrl - путь к шаблону компонента
- styleUrls - путь к файлу стилей компонента

СSS-селектор 'app-heroes', также соответствует имени элемента HTML, который идентифицирует этот компонент в шаблоне родительского компонента.

Метод ngOnInit - хук жизненного цикла компонента.  Angular вызывает ngOnInit незамедлительно после создания компонента. Хорошее место для описания логики инициализации.

Всегда экспортируйте класс компонента, чтобы вы могли импортировать его в дрогом месте, например, AppModule.

Дальше, добавим свойство hero в HeroesComponent для героя, например, Windstorm.

```
hero = 'Windstorm';
```

Для отображения имени героя откроем файл шаблона heroes.component.html. Удалим из него все и запишем одну строку

```
{{ hero }}
```

\- которая будет выводить имя нашего героя.

Отобразим наш компонент на экран. Для этого нам нужно добавить HeroesComponent в AppComponent.

> Запомним, что app-heroes - селектор компонента HeroesComponent.

Поэтому добавим элемент <app-heroes> в файл шаблона AppComponent, чуть ниже названия.

```
<h1>{{title}}</h1>
<app-heroes></app-heroes>
```

Предполагая, что команда CLI ng serve все еще запущена, браузер должен обновить и отобразить как заголовок приложения, так и имя героя.

### Модель Героя

Настоящий герой - не просто имя.

Создайте класс Hero в своем файле в папке src/app. Дайте ему свойства id и name.

```
export class Hero {
  id: number;
  name: string;
}
```

Вернемся в HeroesComponent и импортируем туда модель Hero и немного отрефакторим наш код, изменив тип свойства hero со string на Hero и сразу же его инициализируем { id: 1, name: 'Windstorm' }.

```
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  constructor() { }

  ngOnInit() {
  }

}
```

Страница больше не отображается должным образом, потому что мы изменили героя из строки в объект.

### Отобразим объект angular на экран

```
<h2>{{hero.name}} Details</h2>
<div><span>id: </span>{{hero.id}}</div>
<div><span>name: </span>{{hero.name}}</div>
```

Браузер перезагрузиться и отобразит желаемую информацию.

### Отформатируем текст с помощью UppercasePipe

```
<h2>{{hero.name | uppercase}} Details</h2>
```

После обновления, увидим что имя героя отображается заглавными буквами. Слово uppercase в интерполяции сразу после оператора | активирует встроенный в Angular UppercasePipe.

Pipes - способ форматирования строк, сумм валют, дат и других отображаемых данных. Angular поставляеться с несколькими встроенными пайпами, а также, мы можем создавать свои собственные.

### Редактор героев

Пользователи должны иметь возможность редактировать имя героя в текстовом поле <input>.

Текстовое поле должно отображать свойство имени героя и обновлять это свойство по вводу пользователя. Это означает, что поток данных из класса компонента выводит на экран и обратно возращает ввод в класс.

Чтобы автоматизировать этот поток, настроим двустороннюю привязку (two-way data binding) между элементом формы <input> и свойством hero.name.

#### Двусторонее связывание

Обновим шаблон HeroesComponent

```
<div>
  <label>name:
    <input [(ngModel)]="hero.name" placeholder="name">
  </label>
</div>
```

**\[(ngModel)\] -** синтаксис двустороннего связывания данных в Angular.

Здесь мы связвываем свойство hero.name с текстовым полем HTML, чтобы данные могли поступать в обоих направлениях: от свойства hero.name до текстового поля и от текстового поля обратно к имени hero.name.

> Обратите внимание, что приложение перестало работать, когда вы добавили \[(ngModel)\].
> 
> Чтобы увидеть эту ошибку, откройте средства разработки браузера и загляните в консоль для сообщения типа

```
Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.
```

Хотя ngModel является действующей директивой Angular, по умолчанию она недоступена.

Она принадлежит к дополнительному модулю FormsModule, и вы должны его использовать.

### AppModule

Angular-у нужно знать, какие части приложения работают вместе и какие файлы и библиотеки требуются. Эта информация называется метаданными.

Некоторые метаданные находятся в декораторах @Component, добавленных в классы компонентов. Другие критические метаданные находятся в декораторах @NgModule.

Самый важный декоратор @NgModule аннотирует класс AppModule верхнего уровня.

Angular CLI сгенерировал класс AppModule в src/app/app.module.ts, когда был создан проект. Сюда же мы и добавим наш FormsModule.

```
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
```

```
imports: [
  BrowserModule,
  FormsModule
],
```

Так же нам нужно сообщить фреймворку что у нас появился новый компонент. Для этого в файле app.module.ts добавим:

```
import { HeroesComponent } from './heroes/heroes.component';
```

```
declarations: [
  AppComponent,
  HeroesComponent
],
```

Когда браузер обновится, приложение должно снова работать. Вы можете отредактировать имя героя и увидеть изменения, отраженные сразу в <h2> над текстовым полем.

### Code review

```
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  constructor() { }

  ngOnInit() {
  }

}
```

```
<h2>{{hero.name | uppercase}} Details</h2>
<div><span>id: </span>{{hero.id}}</div>
<div>
  <label>name:
    <input [(ngModel)]="hero.name" placeholder="name">
  </label>
</div>
```

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

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
<app-heroes></app-heroes>
```

```
export class Hero {
  id: number;
  name: string;
}
```

### Итоги

- Использовали консоль для создания второго компонента
- Вывели компонент на екран
- Использовали форматирование текста при помощи UppercasePipe
- Научились использовать дву-стороннее связывание данных при помощи ngModel
- Немного затронули AppModule
- Импортировали необходимые зависимости для работы нашего приложения
