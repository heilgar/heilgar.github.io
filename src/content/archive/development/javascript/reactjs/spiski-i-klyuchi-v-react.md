---
title: "Списки и ключи в React"
date: 2017-11-13
categories: 
  - "reactjs"
---

> Во-первых, давайте рассмотрим, как вы преобразовываете списки в JavaScript.

Учитывая приведенный ниже код, мы используем функцию map(), чтобы взять массив чисел и удвоить их значения. Мы присваиваем новый массив, возвращаемый map(), переменной, удвоенной и записываем в нее:

<!--more-->

```
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Этот код регистрирует \[2, 4, 6, 8, 10\] в консоли.

В React преобразование массивов в списки элементов почти одинаково.

## Отображение нескольких компонентов

Вы можете создавать коллекции элементов и включать их в JSX, используя фигурные скобки {}.

Ниже мы прокручиваем массив чисел, используя функцию JavaScript map(). Мы возвращаем элемент <li> для каждого элемента. Наконец, мы назначим результирующий массив элементов listItems:

```
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Мы включаем весь массив listItems внутри элемента <ul> и передаем его в DOM:

```
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

Этот код отображает список чисел от 1 до 5

## Базовый компонент списка

Обычно вы должны отображать списки внутри компонента.

Мы можем реорганизовать предыдущий пример в компонент, который принимает массив чисел и выводит неупорядоченный список элементов.

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Когда вы запустите этот код, вам будет выведено предупреждение о том, что для элементов списка должен быть предоставлен ключ. «Ключ» - это специальный атрибут строки, который необходимо включить при создании списков. Мы обсудим, почему это важно в следующем разделе. Давайте назначим ключ для наших элементов списка внутри numbers.map() и исправим недостающую ключевую проблему.

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

* * *

## Ключи списков React

Ключи нужны в списках React нужны что бы знать, какие элементы были изменены, добавлены или удалены. Ключи должны быть предоставлены элементам внутри массива, чтобы дать элементам устойчивое тождество:

```
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Лучший способ выбрать ключ - использовать строку, которая однозначно идентифицирует элемент списка среди всех остальных. Чаще всего вы будете использовать идентификаторы из ваших данных в качестве ключей:

```
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Если у вас нет уникальных идентификаторов для отображаемых товаров, вы можете использовать индекс товара в качестве ключа:

```
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

Мы не рекомендуем использовать индексы для ключей, если элементы могут изменить порядок, поскольку это будет медленно. Вы можете прочитать подробное объяснение того, почему ключи необходимы, в следующих статьях.

## Извлечение компонентов с помощью ключей

Ключи имеют смысл только в контексте массива.

Например, если вы извлекаете компонент ListItem, вы должны держать ключ в элементев массиве <ListItem /> , а не в корневом элементе <li> в самом элементе ListItem.

**Пример: неправильное использование ключа**

```
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Пример: правильное использование ключа**

```
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()}
              value={number} />

  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

## Ключи должны быть уникальными среди всех остальных

Ключи, используемые в массивах, должны быть уникальными среди других. Однако им не обязательно быть глобально уникальными. Мы можем использовать те же ключи, когда мы создаем два разных массива:

```
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

Ключи служат подсказкой для React, но они не передаются вашим компонентам. Если вам нужно то же самое значение в вашем компоненте, пропустите его явно как props с другим именем:

```
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

В приведенном выше примере компонент Post может читать props.id, но не props.key.

## Вложение map() в JSX

В приведенных выше примерах мы объявили отдельную переменную listItems и включили ее в JSX:

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />

  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX позволяет встраивать любые выражения в фигурные скобки, чтобы мы могли встроить результат map():

```
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />

      )}
    </ul>
  );
}
```

Иногда это приводит к более четкому коду, но этим стилем  написание также можно злоупотреблять. Как и в JavaScript, вам решать, стоит ли извлекать переменную для удобочитаемости. Имейте в виду, что если тело map() слишком длинное, возможно, самое время извлечь компонент.
