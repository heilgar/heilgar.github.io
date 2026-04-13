---
title: "5. Master/Detail компоненты. Tour of Heroes"
date: 2018-09-27
categories: 
  - "angular"
---

На данный момент HeroesComponent отображает список героев и детали выбранного героя.

Хранение всех функций в одном компоненте по мере роста приложения приведет к осложнениям в поддержке проекта. Возможно вы захотите разделить большие компоненты на более мелкие субкомпоненты, каждый из которых ориентирован на конкретную задачу или рабочий процесс.

На этой странице мы сделаем первый шаг в этом направлении, переместив детали героя в отдельный, переиспользуемый HeroDetailComponent.

В HeroesComponent останется только список героев. HeroDetailComponent представит детали выбранного героя.

CLI

```
ng generate component hero-detail
```

Ранее мы уже генерировали компоненты таким образом, так что я не буду возвращаться к описанию.

### Шаблон

Переместим HTML детали героя с шаблона HeroesComponent и вставим его в сгенерированный шаблон HeroDetailComponent.

Вложенный HTML-код относится к selectedHero. Новый HeroDetailComponent может представить любого героя, а не только выбранного героя. Поэтому замените «selectedHero» на «hero» по шаблону.

Когда вы закончите, шаблон HeroDetailComponent должен выглядеть следующим образом:

```
<div *ngIf="hero">

  <h2>{{hero.name | uppercase}} Details</h2>
  <div><span>id: </span>{{hero.id}}</div>
  <div>
    <label>name:
      <input [(ngModel)]="hero.name" placeholder="name"/>
    </label>
  </div>

</div>
```

### Добавим @Input() свойство

Шаблон компонента HeroDetail связывает свойство героя компонента, которое имеет тип Hero. Откройте файл класса компонентов детали героя и импортируйте Hero.

```
import { Hero } from '../hero';
```

Свойство hero должно быть свойством Input, аннотированное с помощью декоратора @Input(), потому что внешний HeroesComponent будет привязываться к нему следующим образом

```
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
```

Для того что бы нам использовать декоратор @Input импортируем его из angular/core

```
import { Component, OnInit, Input } from '@angular/core';
```

и добавим ему свойство hero

```
@Input() hero: Hero;
```

Это единственное изменение, которое вы должны внести в класс HeroDetailComponent. Больше нет свойств. Нет логики представления. Этот компонент просто получает объект героя через свойство героя и отображает его.

### Отобразим HeroDetailComponent

HeroesComponent по-прежнему является основным / подробным представлением.

Раньше он отображал детали героя самостоятельно, прежде чем вырезали эту часть шаблона. Теперь он будет делегировать HeroDetailComponent.

Эти два компонента будут иметь родительские / дочерние отношения. Родительский HeroesComponent будет управлять дочерним элементом HeroDetailComponent, отправив ему нового героя, который будет отображаться всякий раз, когда пользователь выбирает героя из списка.

Мы не будем изменять класс HeroesComponent, но мы изменим его шаблон.

Селектор для HeroDetailComponent - это «app-hero-detail». Добавим элемент <app-hero-detail> в нижней части шаблона HeroesComponent, где раньше был вид детали героя и свяжем HeroesComponent.selectedHero к свойству героя элемента

```
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
```

`[hero]="selectedHero"` привязка свойств в Angular

Это односторонняя привязка данных к свойству selectedHero объекта HeroesComponent к свойству героя целевого элемента, который сопоставляется с свойством героя HeroDetailComponent.

Теперь, когда пользователь нажимает на героя в списке, selectedHero изменяется. Когда selectedHero изменяется, свойство hero изменяется и  HeroDetailComponent отображает нового героя.

Измененный шаблон HeroesComponent должен выглядеть следующим образом:

```
<h2>My Heroes</h2>

<ul class="heroes">
  <li *ngFor="let hero of heroes"
    [class.selected]="hero === selectedHero"
    (click)="onSelect(hero)">
    <span class="badge">{{hero.id}}</span> {{hero.name}}
  </li>
</ul>

<app-hero-detail [hero]="selectedHero"></app-hero-detail>
```

### Что мы изменили?

Как и прежде, всякий раз, когда пользователь нажимает на имя героя, деталь героя появляется ниже списка героев. Теперь HeroDetailComponent представляет эти детали вместо HeroesComponent.

Рефакторинг оригинального HeroesComponent на два компонента дает преимущества, как сейчас, так и в будущем:

1. Упростили HeroesComponent уменьшив его ответственность
2. Можем превратить HeroDetailComponent в редактор героя не затрагивая при это HeroesComponent
3. Можем вносить изменения в HeroesComponent при этом не затрагивая логику отображения
4. Можем преиспользовать HeroDetailComponent в любой части приложения

### Code review

```
import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor() { }

  ngOnInit() {
  }

}
```

```
<div *ngIf="hero">

  <h2>{{hero.name | uppercase}} Details</h2>
  <div><span>id: </span>{{hero.id}}</div>
  <div>
    <label>name:
      <input [(ngModel)]="hero.name" placeholder="name"/>
    </label>
  </div>

</div>
```

```
<h2>My Heroes</h2>

<ul class="heroes">
  <li *ngFor="let hero of heroes"
    [class.selected]="hero === selectedHero"
    (click)="onSelect(hero)">
    <span class="badge">{{hero.id}}</span> {{hero.name}}
  </li>
</ul>

<app-hero-detail [hero]="selectedHero"></app-hero-detail>
```

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent
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

### Итог

- Создали отдельный, переиспользуемый компонент
- Использовали связывание свойств между родительским и дочерним компонентом
- Использовали @Input декоратор для связывания свойства компонента
