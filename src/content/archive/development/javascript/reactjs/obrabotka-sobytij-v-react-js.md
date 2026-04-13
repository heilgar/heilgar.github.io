---
title: "Обработка событий в React js"
date: 2017-11-11
categories: 
  - "reactjs"
---

Обработка событий в элементах React очень похожа на обработку событий на элементах DOM. Существуют синтаксические различия:

- React события называются с помощью camelCase, а не в нижнем регистре.
- B JSX вы передаете функцию как обработчик события, а не строку.

<!--more-->

Пример,

```
// HTML
<button onclick="activateLasers()">
  Activate Lasers
</button>

// React
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

Другое отличие состоит в том, что вы не можете вернуть false, чтобы предотвратить поведение по умолчанию в React. Вы должны явно вызвать preventDefault. Например, с помощью обычного HTML, чтобы предотвратить поведение ссылки по умолчанию при открытии новой страницы, вы можете написать:

```
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

В React же, обязательно использовать e.preventDafault(),

```
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

Здесь e - синтетическое событие. React определяет эти синтетические события в соответствии со [спецификацией W3C](https://www.w3.org/TR/DOM-Level-3-Events/), поэтому вам не нужно беспокоиться о совместимости между браузерами. См. Справочное руководство SyntheticEvent, чтобы узнать больше.

При использовании React вам обычно не нужно вызывать addEventListener, чтобы добавить обработчик события в элемент DOM после его создания. Вместо этого просто передавайте обработчик, когда элемент изначально отображается.

Когда вы определяете компонент с использованием класса ES6, общий шаблон для обработчика события является методом класса. Например, компонент Toggle отображает кнопку, которая позволяет пользователю переключаться между состояниями «ON» и «OFF»:

```
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

Вы должны быть осторожны со значением this в callback функциях JSX. В JavaScript методы класса не связаны по умолчанию. Если вы забудете связать this.handleClick и передать его onClick, onClick вернет `undefined`, когда функция будет вызывается.

Это не относится к React-поведению; это часть того, как функции работают в JavaScript. Как правило, если вы ссылаетесь на метод без (), например onClick = {this.handleClick}, вы должны связать этот метод.

Если вызов bind раздражает вас, есть два способа обойти это. Если вы используете синтаксис babel [Class properties transform](https://babeljs.io/docs/plugins/transform-class-properties/), вы можете использовать поля классов для правильного привязки обратных вызовов:

```
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

Этот синтаксис включен по умолчанию в приложении Create React. Если вы не используете синтаксис class field, вы можете использовать arrow function в обратном вызове:

```
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

Проблема с этим синтаксисом заключается в том, что при обращении к LoggingButton создается другой обратный вызов. В большинстве случаев это нормально. Однако, если этот обратный вызов передается в качестве props для дочерних компонентов, эти компоненты могут выполнять дополнительный рендеринг. Обычно мы рекомендуем привязывать конструктор или использовать поля классов, чтобы избежать проблем с производительностью.

* * *

## Передача аргументов в обработчик событий

Внутри цикла обычно требуется передать дополнительный параметр обработчику событий. Например, если id является идентификатором строки, будет работать одно из следующих:

```
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

Вышеуказанные две строки эквивалентны и используют arrow function и Function.prototype.bind.

В обоих случаях аргумент e, представляющий событие React, будет передан второй аргумент ID. С помощью arrow function мы должны передавать ее явно, но когда мы импользуем bind аргументы автоматически пересылаются в обработчик.
