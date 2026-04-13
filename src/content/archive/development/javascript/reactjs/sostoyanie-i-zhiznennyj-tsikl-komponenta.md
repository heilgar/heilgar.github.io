---
title: "Состояние и жизненный цикл компонента"
date: 2017-11-11
categories: 
  - "reactjs"
---

До сих пор мы только рассмотрили один способ обновления пользовательского интерфейса.

Мы вызывали ReactDOM.render() в "цикле"

```
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

В этом разделе мы узнаем, как сделать компонент Clock действительно многоразовым и инкапсулированным. Он будет настраивать свой собственный таймер и обновляться каждую секунду.

Мы можем начать с инкапсуляции комопонента часов:

```
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

Тем не менее, это не соответствует критическому требованию: тот факт, что`Clock` устанавливает таймер и обновляет пользовательский интерфейс каждую секунду, должен быть деталью реализации`Clock`. В идеале мы хотим написать это один раз и иметь обновление времени внутри компонента`Clock`:

```
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Чтобы это реализовать, нам нужно добавить «состояние» к компоненту «`Clock`». Состояние похоже на props, но оно является частным и полностью контролируется компонентом. Мы [упоминали ранее](http://thewebland.net/development/javascript/reactjs/komponenty-components-i-svojstva-props-v-react/), что компоненты, определенные как классы, имеют некоторые дополнительные функции. Локальное состояние - это именно та функция которая доступна только для классов.

* * *

## Преобразование функции в класс

Вы можете преобразовать функциональный компонент, например Clock, в класс за пять шагов:

1. Создайте ES6 класс с тем же именем. Класс будет расширять React.Component.
2. Добавьте к нему один пустой метод под названием render().
3. Переместите тело функции в метод render().
4. Замените prop с на this.props в теле render().
5. Удалить оставшееся объявление функции.

```
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

`Clock` теперь определяются как класс, а не функция. Это позволяет нам использовать дополнительные функции, такие как локальное состояние и перехват жизненного цикла.

## Добавляем локальное состояние в класс

Мы переместим date из props в три этапа:

- Замените this.props.date на this.state.date в методе render()

```
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

- Добавим инициализацию this.state в конструкторе класса

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Обратите внимание, мы должны передать props в родительский класс. **Конструктор класса компонента должен всегда вызывать базовый конструктор и передавать ему props.**

```
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

- Удалите `date` prop из елемента  `<Clock />`

```
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Позднее мы добавим код таймера обратно к самому компоненту. Результат выглядит следующим образом:

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Далее мы сделаем настройку таймера и обновление каждую секунду внутри компонента `Clock`.

* * *

## Добавление методов жизненного цикла компонента в класс

В приложениях с большим количеством компонент, очень важно высвобождать ресурсы, используемые компонентами при их уничтожении. Мы хотим настроить таймер, когда Clock отображается в DOM в первый раз. Это называется «mount» в React. Мы также хотим очистить этот таймер всякий раз, когда DOM, созданный Clock, удаляется. Это называется «unmount» в React. Мы можем объявить специальные методы для класса компонентов для запуска некоторого кода, когда компонент mount и unmount:

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Эти методы называются «хуками жизненного цикла».

componentDidMount () запускается после вывода компонента в DOM. Это хорошее место для установки таймера:

```
componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Обратите внимание, как мы сохраняем идентификатор таймера в`this`.

Хотя this.props настраивается самим React, this.state имеет особое значение, вы можете добавлять дополнительные поля в класс вручную, если вам нужно сохранить что-то, что не используется для визуального вывода. Если вы не используете что-то в render(), оно не должно находиться в this.state. Мы уничтожем наш таймер в методе componentWillUnmount ():

```
componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Наконец, мы будем применять метод, называемый tick(), который компонент Clock будет запускать каждую секунду. Он будет использовать this.setState() для обновления локального состояния компонента:

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[Попробовать код онлайн.](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Теперь, после всех наших манипуляций часы тикают каждую секунду.

Давайте быстро вспомним, что происходит, и порядок, в котором вызываются методы:

1. Когда`<Clock />` передается в`ReactDOM.render()`, React вызывает конструктор компонента`Clock`. Поскольку`Clock` должен отображать текущее время, он инициализирует объект this.state, и устанавливает текущее время. Позднее мы обновим это состояние.
2. Затем React вызывает метод `render()` компонента`Clock`. Так React узнает, что должно отображаться на экране. Затем React обновляет DOM, чтобы соответствовать результату рендеринга`Clock`.
3. Когда `Clock` вставлен в DOM, React вызывает хук жизненного цикла`componentDidMount()`. Внутри компонента`Clock` запрашивает у браузера настройку таймера для вызова метода`tick()` компонента один раз в секунду
4. Каждую секунду браузер вызывает метод tick(). Компонент Clock планирует обновление UI, вызвав setState() с объектом, содержащим текущее время. Благодаря вызову setState() React знает, что состояние изменилось, и снова вызывает метод render(), чтобы вывести то что должно быть на экране. На этот раз this.state.date в методе render() будет другим, и поэтому рендеринг будет включать в себя обновленное время. React обновляет DOM.
5. Если компонент «`Clock`» удаляется из DOM, React вызывает hook `componentWillUnmount` (), чтобы таймер был остановлен.

* * *

## Используем состояние правильно

Есть три вещи, которые вы должны знать о setState().

### Не изменять состояние напрямую

Например, это не приведет к повторному рендерингу компонента:

```
// Wrong
this.state.comment = 'Hello';
```

Вместо этого нужно использовать setState метод

```
// Correct
this.setState({comment: 'Hello'});
```

Единственным местом, где вы можете назначить this.state, является конструктор.

### Обновления состояния может быть асинхронным

React может выполнять несколько вызовов setState() в одно обновление для производительности. Поскольку this.props и this.state могут обновляться асинхронно, вы не должны полагаться на их значения для вычисления следующего состояния. Например, этот код может не обновить счетчик:

```
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});

```

Чтобы исправить это, используйте вторую форму setState(), которая принимает функцию, а не объект. Эта функция получит предыдущее состояние в качестве первого аргумента и props во время обновления в качестве второго аргумента:

```
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

Мы использовали [**arrow function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) выше, но также можно писать обычные функции:

```
// Correct
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});
```

### Обновление состояние это объединение

Когда вы вызываете setState(), React объединяет объект, который вы указываете, с текущим состоянием. Например, ваше состояние может содержать несколько независимых переменных:

```
 constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Затем вы можете самостоятельно обновлять их с помощью отдельных вызовов setState ():

```
componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

Слияние неглубокое, поэтому this.setState ({comments}) оставляет this.state.posts неповрежденным, но полностью заменяет this.state.comments.

* * *

## Потоки данных

Ни родительский, ни дочерний компоненты не могут знать, является ли какой-либо компонент активным или нет, и им не важно, определено ли оно как функция или класс. Вот почему состояние часто называют локальным или инкапсулированным. Состояние недоступно для любого компонента, кроме того, который владеет и устанавливает его. Компонент может передать свое состояние вниз в качестве props его дочерних компонентов:

```
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

Это также работает для пользовательских компонентов:

```
<FormattedDate date={this.state.date} />
```

Компонент FormattedDate получит дату в своих props и не будет знать, пришла ли она из состояния Clock, из props Clock или был набран вручную:

```
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

Это обычно называют потоком данных «сверху вниз» или «однонаправленным». Любое состояние всегда принадлежит определенному компоненту, и любые данные или пользовательский интерфейс, полученные из этого состояния, могут влиять только на компоненты «ниже» их в дереве. Если вы представляете дерево компонентов как водопад props, состояние каждого компонента похоже на дополнительный источник воды, который соединяет его в произвольной точке, но также течет вниз. Чтобы показать, что все компоненты действительно изолированы, мы можем создать компонент приложения, который отображает три <Clock> :

```
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

Каждый Clock устанавливает свой собственный таймер и обновляется независимо. В React, независимо от того, является ли компонент устаревшим или неактивным, рассматривается как деталь реализации компонента, которая может меняться со временем. Вы можете использовать компоненты без состояния в компонентах stateful, и наоборот.
