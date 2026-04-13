---
title: "React js, учебник, документация"
date: 2017-11-05
---

 

## ![](./images/react_best_practices-1453211146748.png)

## **Установка React**

React гибкая библиотека которая может использоваться в различных проектах. Вы можете создавать приложения React с нуля или же добавлять уже в существующий код не переписывая ничего.

В зависимости от вашего проекта вы можете выбрать свой способ установки. React доступен как пакет react в менеджере [npm](https://www.npmjs.com/). А также доступен через [CDN](http://thewebland.net/development/javascript/reactjs/installation/#cdn).

- [Установка React js](http://thewebland.net/development/javascript/reactjs/installation/)
- [Попробовать React без установки](http://thewebland.net/development/javascript/reactjs/installation/#try)
- [Создание нового приложения на React](http://thewebland.net/development/javascript/reactjs/installation/#create-react-app)
- [Добавляем React в существующее приложение](http://thewebland.net/development/javascript/reactjs/installation/#add-to-existing-project)

## **Документация React js**

Вы можете найти оригинальную документацию по React у них [на сайте reactjs.org/docs](https://reactjs.org/docs).

Материалы по разработке веб приложений с reactjs

\[widgets\_on\_pages id="React materials"\]

Вы можете улучшить официальную документацию отправив pull request в [репозиторий](https://github.com/reactjs/reactjs.org).

React - JavaScript библиотека для построения пользовательских интерфейсов.

- **Декларативный:** React помогает безболезненно создавать интерактивные пользовательские интерфейсы. Создавайте простые представления для каждого состояния вашего приложения, и React будет обновлять и отображать только нужные компоненты в которых изменились ваших данные. Декларативный подход делает ваш код более предсказуемым, легким в понимании и отладке.
- **Компонентно-ориентированный:** Инкапсулированные компоненты, которые управляют своим состоянием, а затем скомпонуйте их для создания сложных пользовательских интерфейсов. Поскольку логика компонента написана в JavaScript коде, вместо шаблона, вы можете легко хранить множество данных в своем приложение и сохранять состояние вне вашего DOM дерева.
- **Изучи раз, Пиши где-угодно:** Мы не делаем предположений о остальной части вашего технологического стека, поэтому вы можете создавать новые функции в React без изменения вашего существующего кода. React поддерживает рендеринг на стороне сервера (server side rendering) используя Node. Также на React можно писать мобильные приложения используя [React Native](https://facebook.github.io/react-native/).

## Пример React js

```
class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

ReactDOM.render(
  <HelloMessage name="John" />,
  document.getElementById('container')
);
```

В этом примере показано как вывести "Hello John" в контейнер на странице.

Вы должный уже были заметить что мы использовали HTML-подобный синтаксис - который называеться JSX. Не обязательно использовать JSX в React, но он делает код более читабельным, а его написание схоже с HTML. Рекомендуется использовать  [Babel](https://babeljs.io/) с плагином e, and writing it feels like writing HTML. We recommend usingwith a [React preset](https://babeljs.io/docs/plugins/preset-react/) для конвертации JSX в нативный JavaScript для отображения в браузере.
