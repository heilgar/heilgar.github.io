---
title: "Формы в ReactJS"
date: 2017-11-13
categories: 
  - "reactjs"
---

Элементы HTML формы работают немного иначе, чем другие элементы DOM в React, потому что элементы формы естественным образом сохраняют некоторое внутреннее состояние. Например, эта форма в обычном HTML допускает одно имя:

<!--more-->

```
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

Эта форма имеет поведение HTML-формы по умолчанию для просмотра на новой странице, когда пользователь отправляет форму. Если вы хотите, чтобы это было в React, это просто работает. Но в большинстве случаев удобно иметь функцию JavaScript, которая обрабатывает представление формы и имеет доступ к данным, которые пользователь вводил в форму. Стандартный способ достичь этого - технологии под названием «контролируемые компоненты».

* * *

## Контролируемые компоненты

Элементы HTML формы, такие как <input>, <textarea> и <select>, как правило, поддерживают собственное состояние и обновляют его на основе ввода пользователем. В React, состояние обычно сохраняется в состоянии свойства компонентов и обновляется только с помощью setState(). Мы можем объединить их, сделав Реагированное состояние «единственным источником истины». Затем компонент React, который отображает форму, также контролирует, то что происходит в этой форме при последующем вводе пользователя. Элемент входной формы, значение которого контролируется React, таким образом, называется «управляемым компонентом». Например, если мы хотим, чтобы предыдущий пример регистрировал имя при его отправке, мы можем написать форму как контролируемый компонент:

```
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

```

Поскольку атрибут value установлен в нашем элементе формы, отображаемое значение всегда будет this.state.value, что делает React state источником истины. Поскольку handleChange работает при каждом нажатии клавиши, чтобы обновить состояние React, отображаемое значение будет обновляться по мере ввода пользователем. С управляемым компонентом каждая мутация состояния будет иметь связанную функцию обработчика. Это упрощает изменение или проверку ввода пользователя. Например, если мы хотим, чтобы эти имена записывались со всеми заглавными буквами, мы могли бы написать handleChange как:

```
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## textarea тег

В HTML, элемент <textarea> определяет его текст своими дочерними элементами:

```
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

В React <textarea> использует атрибут value. Таким образом, форма с использованием <textarea> может быть написана очень похоже на форму, использующую однострочный ввод:

```
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Обратите внимание, что this.state.value инициализируется в конструкторе, так что текстовая область начинается с некоторого текста в нем.

* * *

## select тег

В HTML <select> создает раскрывающийся список. Например, этот HTML создает раскрывающийся список вкусов:

```
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>

```

Обратите внимание, что параметр Coconut изначально выбран как атрибут по умолчанию. Вместо использования этого выбранного атрибута, используется атрибут value в теге root select. Это более удобно в управляемом компоненте, потому что вам нужно только обновить его в одном месте. Например:

```
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite La Croix flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

В целом,  <input type = "text">, <textarea> и <select> все работают очень похоже - все они принимают атрибут value, который можно использовать для реализации управляемого компонента.

> **Note**
> 
> Вы можете передать массив в атрибут value, позволяя выбрать несколько опций в теге select:
> 
> ```
> <select multiple={true} value={['B', 'C']}>
> ```

* * *

## Обработка нескольких полей

Когда вам нужно обрабатывать несколько управляемых элементов ввода, вы можете добавить атрибут имени к каждому элементу и позволить функции обработчика выбрать, что делать, исходя из значения event.target.name. Например:

```
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

Обратите внимание, как мы использовали синтаксис ES6 для обновления ключа состояния, соответствующего данному имени ввода:

```
this.setState({
  [name]: value
});
```

Это эквивалентно этому ES5-коду:

```
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Кроме того, поскольку setState () автоматически объединяет частичное состояние в текущее состояние, нам нужно было только вызвать его с измененными частями.

* * *

## Контролируемое входное значение Null

Указание поддержки значения на управляемом компоненте не позволяет пользователю изменять ввод, если вы этого не хотите. Если вы указали значение, но ввод все еще доступен для редактирования, возможно, вы случайно установили значение неопределенным или null. Следующий код демонстрирует это. (Сначала ввод заблокирован, но становится доступным после короткой задержки.)

```
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);
```

* * *

## Альтернативы контролируемым компонентам

Иногда бывает сложно использовать контролируемые компоненты, потому что вам нужно написать обработчик событий для каждого способа, которым ваши данные могут измениться, и передать все входное состояние через компонент React. Это может стать особенно раздражающим, когда вы конвертируете существующую базу кода в React или интегрируете приложение React с библиотекой, отличной от React. В таких ситуациях вы можете проверить неконтролируемые компоненты, альтернативный метод для реализации входных форм.
