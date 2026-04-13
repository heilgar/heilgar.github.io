---
title: "Conditional рендеринг"
date: 2017-11-13
categories: 
  - "reactjs"
---

> В React вы можете создавать отдельные компоненты, которые инкапсулируют поведение, которое вам нужно. Затем вы можете отображать только некоторые из них, в зависимости от состояния вашего приложения.

<!--more-->

**Условный** рендеринг в React работает так же, как **условные функции** в JavaScript. JavaScript-операторы, например if или [условный (тернарный) оператор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), для создания элементов, представляющих текущее состояние, и React обновит пользовательский интерфейс. Рассмотрим эти два компонента:

```
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

Мы создадим компонент Greeting, который отображает один из этих компонентов в зависимости от того, вошел ли пользователь в систему:

```
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

Этот пример отображает другое приветствие в зависимости от значения isLoggedIn prop

* * *

## Переменные элемента

Вы можете использовать переменные для хранения элементов. Это может помочь вам отобразить часть компонента, в то время как остальная часть вывода не изменится. Рассмотрим эти два новых компонента, представляющих кнопки Logout и Login:

```
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

В приведенном ниже примере мы создадим компонент с состоянием, называемый LoginControl. Он будет отображать либо <LoginButton />, либо <LogoutButton /> в зависимости от текущего состояния. Он также отобразит <Greeting /> из предыдущего примера:

```
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

Хотя объявление переменной и использование оператора if - прекрасный способ отобразить компонент, иногда вам может понадобиться использовать более короткий синтаксис. В JSX существует несколько способов включения условий, описанных ниже.

## Строковый IF и логический оператор AND (&&)

Вы можете вставлять любые выражения в JSX, обертывая их фигурными скобками. Это включает в себя логический && оператор JavaScript. Это может быть удобно для включения элемента:

```
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

Это работает, потому что в JavaScript `true && expression` оценивает`expression`, а выражение`false && expression` всегда оценивается как`false`. Поэтому, если условие истинно, элемент справа после`&&`появится на выходе. Если нет, React игнорирует и пропускает его.

## Строковый If-Else с условным оператором

Другой метод рендеринга строковых элементов заключается в использовании условного оператора JavaScript condition ? true : false. В приведенном ниже примере мы используем его для отображения небольшого блока текста.

```
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

Также можно использовать для более сложных выражений, хотя менее очевидно, что происходит:

```
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Как и в JavaScript, вы можете выбрать подходящий стиль, основанный на том, что вы и ваша команда считаете более читаемыми. Также помните, что всякий раз, когда условия становятся слишком сложными, возможно, самое время [извлечь компонент](http://thewebland.net/development/javascript/reactjs/komponenty-components-i-svojstva-props-v-react/).

## Предотвращение рендеринга компонента

В редких случаях вы можете захотеть, чтобы компонент спрятался, даже если он был отображен другим компонентом. Для этого возвращаем null вместо вывода рендеринга. В приведенном ниже примере <WarningBanner/> отображается в зависимости от значения prop, называемого warn. Если значение prop является ложным, то компонент не отображается:

```
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

Возврат null из метода рендеринга компонента не влияет на запуск методов жизненного цикла компонента. Например, componentWillUpdate и componentDidUpdate все равно будут вызываться.
