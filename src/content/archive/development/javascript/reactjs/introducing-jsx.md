---
title: "Введение в JSX"
date: 2017-11-06
categories: 
  - "reactjs"
---

JSX - это препроцессор, который добавляет синтаксис XML к JavaScript. Вы можете использовать React без JSX, но JSX делает React более элегантным.<!--more-->

JSX - синтаксис, похожий на XML / HTML, используемый в React, расширяет ECMAScript, так что XML / HTML-подобный текст может сосуществовать с кодом JavaScript / React. Синтаксис предназначен для использования препроцессорами (т. е. транспилерами, такими как Babel), чтобы преобразовать HTML-подобный текст, найденный в файлах JavaScript, в стандартные объекты JavaScript, которые будут анализировать движок JavaScript.

В основном, используя JSX, вы можете писать сжатые структуры HTML / XML (например, DOM подобные древовидные структуры) в том же файле, что и код JavaScript, а затем Babel преобразует эти выражения в код JavaScript. В отличие от прошлого, вместо того, чтобы помещать JavaScript в HTML, JSX позволяет нам помещать HTML в JavaScript.

Рассмотрим объявление переменной:

```
const element = <h1>Hello, world!</h1>;
```

Синтаксис этого смешного тега не является строкой HTML. Он называется JSX, и это расширение синтаксиса JavaScript. Мы рекомендуем использовать его с React для описания того, как должен выглядеть пользовательский интерфейс. JSX может напомнить вам о языке шаблонов, но он поставляется с мощью JavaScript. JSX создает «элементы» React. Мы рассмотрим [рендеринг в DOM](http://thewebland.net/development/javascript/reactjs/rendering-elements/) в следующем разделе. Ниже вы можете найти основы JSX, необходимые для начала работы.

## Выражения в JSX

Вы можете встроить любое выражение JavaScript в JSX, обернув его фигурными фигурными скобками.

Например, 2 + 2, user.firstName и formatName (user) - допустимые выражения:

```
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Мы разделяем JSX на несколько строк для удобства чтения. Хотя этого не требуется, при этом мы рекомендуем обертывать его в круглые скобки, чтобы избежать ловушки автоматической точки с запятой.

### JSX - это выражение

После компиляции выражения JSX становятся обычными объектами JavaScript.

Это означает, что вы можете использовать JSX внутри операторов if или for, назначать его переменным, принимать его как аргументы и возвращать из функций:

```
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Определение атрибутов в JSX:

Вы можете использовать кавычки для указания строковых литералов в качестве атрибутов:

```
const element = <div tabIndex="0"></div>;
```

Вы также можете использовать фигурные скобки для вставки JavaScript в атрибут:

```
const element = <img src={user.avatarUrl}></img>;
```

Не помещайте кавычки вокруг фигурных скобок выражения JavaScript. Вы должны либо использовать кавычки (для строковых значений), либо фигурные скобки (для выражений), но не оба в одном и том же атрибуте.

> **Предупреждение**
> 
> Поскольку JSX ближе к JavaScript, чем HTML, React DOM использует соглашение об именах - camelCase вместо имен атрибутов HTML. Например, class становится className в JSX, а tabindex становится tabIndex.

## Определение дочерних елементов в JSX

Если тег пуст, вы можете его закрыть с помощью />, как в XML:

```
const element = <img src={user.avatarUrl} />;
```

Но если вам нужны дочерние элементы вы можете поступить следующим образом:

```
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

## JSX предотвращает атаки инъекцией

Безопасно встраивать пользовательский ввод в JSX:

```
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

По умолчанию React DOM [исключает](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) любые значения, написанные в JSX, перед их рендерингом. Таким образом, это гарантирует, что вы никогда не сможете выполнить то, что явно не написано в вашем коде. Перед рендерингом все преобразуется в строку. Это помогает предотвратить [XSS (Cross-site scripting) атаки](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3).

## JSX представляет объекты

Babel компилирует JSX по вызову React.createElement(). Два примера ниже идентичны:

```
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

React.createElement() выполняет несколько проверок, чтобы помочь вам писать код без ошибок, но по существу он создает такой объект:

```
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};
```

Эти объекты называются элементами React. Вы можете думать о них как о описаниях того, что вы хотите видеть на экране. React читает эти объекты и использует их для построения и обновления DOM.

Мы рассмотрим [рендеринг элементов React в DOM](http://thewebland.net/development/javascript/reactjs/rendering-elements/) в следующем разделе.

> **Tip**
> 
> Мы рекомендуем использовать «Babel» для вашего редактора, чтобы как ES6, так и JSX-код были правильно подсвечивался.
