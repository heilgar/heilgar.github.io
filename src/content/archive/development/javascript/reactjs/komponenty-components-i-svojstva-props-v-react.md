---
title: "Компоненты (components) и свойства (props) в React"
date: 2017-11-11
categories: 
  - "reactjs"
---

> Компоненты позволяют разделить пользовательский интерфейс на самостоятельные, многоразовые фрагменты.

Концептуально компоненты похожи на функции JavaScript. Они принимают произвольные свойства (называемые «props») и возвращают элементы React, описывающие, что должно появиться на экране.

<!--more-->

## Функциональные и Класс Компоненты React

Самый простой способ определить компонент - написать функцию JavaScript:

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Эта функция является действительной компонентой React, потому что она принимает один аргумент объекта «props» (который обозначает свойства) с данными и возвращает элемент React. Такие компоненты мы называем «функциональными», потому что они являются буквально функциями JavaScript. Вы также можете использовать класс ES6 для определения компонента:

```
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Вышеуказанные два компонента эквивалентны с точки зрения Реакт. Классы имеют некоторые дополнительные функции, которые мы обсудим в следующих разделах. Но пока мы будем использовать функциональные компоненты из-за их краткости.

* * *

## Рендеринг компонента React

Раньше мы встречались только с элементами React, которые представляют теги DOM:

```
const element = <div />;
```

Однако элементы также могут представлять пользовательские компоненты:

```
const element = <Welcome name="Sara" />;
```

Когда React видит элемент, представляющий пользовательский компонент, он передает атрибуты этому компоненту как единый объект. Мы называем этот объект «props».

Например, этот код отображает «Hello, Sara» на странице

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Можно попробовать на CodePen](https://reactjs.org/redirect-to-codepen/components-and-props/rendering-a-component)

Напомним, что происходит в этом примере:

1. Мы называем ReactDOM.render() c элементом <Welcome name = "Sara" />.
2. React вызывает компонент Welcome с props - {name: 'Sara'}.
3. Наш компонент Welcome возвращает результат <h1> Hello, Sara </ h1>.
4. ReactDOM обновляет DOM, чтобы вывести <h1> Hello, Sara </ h1>.

> **Предостережение:**
> 
> Всегда начинайте имена компонентов с большой буквы. Например, <div /> представляет тег DOM, но <Welcome /> представляет компонент и должен соответствовать соглашению по именованию.

## Компонуем компоненты :)

Компоненты могут ссылаться на другие компоненты в их вызове. Это позволяет использовать одну и ту же абстракцию компонента для любого уровня детализации. Кнопка, форма, диалог, экран: в приложениях на React все они обычно выражаются как компоненты. Например, мы можем создать компонент App, который многократно отображает Welcome:

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

Как правило, в новых приложениях React есть один компонент App на самом верху. Однако, если вы интегрируете React в существующее приложение, вы можете начать снизу вверх с помощью небольшого компонента, такого как Button, и постепенно подойдите к вершине иерархии представлений.

## Извлечение компонентов

Не бойтесь разделить компоненты на более мелкие компоненты. Например, рассмотрим компонент Comment:

```
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Он принимает`author` (объект),`text` (строку) и`date` (дату) в качестве props и описывает комментарий социальной сети. Этот компонент сложно изменить из-за всех вложенных элементов, а также трудно повторно использовать отдельные его части. Давайте извлечем из него несколько компонентов. Во-первых, мы извлечем`Avatar`:

```
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />

  );
}
```

`Avatar` не должен знать, что он отображается внутри`Comment`. Вот почему мы передали в props более общее параметры:`user`, вместо `author`. Мы рекомендуем называть protps с точки зрения компонента, а не контекста, в котором он используется. Теперь мы можем упростить`Comment`:

 

```
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Затем мы извлечем компонент`UserInfo`, который выводит `Avatar` рядом с именем пользователя:

```
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Это позволяет нам упростить `Comment` еще больше:

```
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Извлечение компонентов сначала может показаться грубым, но наличие многоразовых компонентов окупается в больших приложениях. Хорошим правилом является то, что если часть вашего пользовательского интерфейса использует несколько раз (`Button`, `Panel`, `Avatar`) или достаточно сложный сам по себе (`App`, `FeedStory`, `Comment`), то он является хорошим кандидатом для того что бы его извлеч и использовать повторно.

## Props доступны только для чтения

Независимо от того, объявляете ли вы компонент как функцию или класс, он никогда не должен изменять свои собственные props. Рассмотрим функцию суммы:

```
function sum(a, b) {
  return a + b;
}
```

Такие функции называются «чистыми», потому что они не пытаются изменить свои значения и всегда возвращают один и тот же результат для одних и тех же входных данных. Напротив, эта функция нечиста, потому что она меняет свои значения:

```
function withdraw(account, amount) {
  account.total -= amount;
}
```

React довольно гибкий, но имеет одно строгое правило:

> **Все компоненты React должны действовать как чистые функции в отношении своих props.**

Конечно, пользовательские интерфейсы динамичны и со временем меняются. В следующем разделе мы представим новую концепцию «state». State позволяет компонентам React изменять свой результат с течением времени в ответ на действия пользователя, сетевые ответы и все остальное, не нарушая это правило.
