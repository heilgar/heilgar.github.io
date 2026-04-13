---
title: "Композиция vs Наследование"
date: 2017-11-14
categories: 
  - "reactjs"
---

React имеет мощную модель композиции, и мы рекомендуем использовать композицию вместо наследования для повторного использования кода между компонентами.

В этом разделе мы рассмотрим несколько проблем, когда новые React разработчики, используют наследование, и как мы можем решить проблему с помощью композиции. <!--more-->

* * *

## Соглашения

Некоторые компоненты не знают своих наследников раньше времени. Это особенно характерно для таких компонентов, как Sidebar или Dialog, которые представляют собой общие «ящики». Мы рекомендуем, чтобы такие компоненты использовали специальные`children` props для вывода в дочерних элементах:

```
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Это позволяет другим компонентам передавать им произвольные дочерние элементы, вставляя JSX:

```
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

Все, что находится внутри тега`<FancyBorder>`JSX, передается в компонент`FancyBorder` в качестве`children prop`. Поскольку`FancyBorder` отображает {props.children} внутри <div>, переданные элементы отображаются в конечном выводе.

Хотя это менее распространено, иногда вам может понадобиться несколько «дыр» в компоненте. В таких случаях вы можете придумать свое собственное соглашение, а не использовать`children`:

```
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

React элементы, такие как <Contacts /> и <Chat />, - это просто объекты, поэтому вы можете передавать их как props, так и любые другие данные.

* * *

## Специализация

Иногда мы рассматриваем компоненты как «частные случаи» других компонентов. Например, мы можем сказать, что WelcomeDialog - это частный случай Dialog. В React это достигается композицией, где более «конкретный» компонент отображает более «общий» и настраивает его с помощью props:

```
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />

  );
}
```

Композиция работает одинаково хорошо для компонентов, определенных как классы:

```
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />

        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

* * *

## Итак, что насчет наследования?

В Facebook используют React в тысячах компонентов, и не обнаружили каких-либо вариантов использования, где рекомендуют создавать иерархии наследования компонентов.

Props и композиция дают вам всю гибкость, необходимую вам для индивидуального и удобного подбора внешнего вида и поведения компонента. Помните, что компоненты могут принимать произвольные prop, включая примитивные значения, элементы React или функции.

Если вы хотите повторно использовать функции, отличные от пользовательского интерфейса между компонентами, мы предлагаем извлечь его в отдельный модуль JavaScript. Компоненты могут импортировать его и использовать эту функцию, объект или класс, не расширяя его.
