import {
  observable,
  computed,
  action,
} from 'mobx'

export default class AppState {
  constructor({ counter, name } = {
    counter: 0,
    name: '张三',
  }) {
    this.counter = counter
    this.name = name
  }

  @observable counter

  @observable name

  @computed get msg() {
    return `${this.name} 说 ${this.counter}`
  }

  @action add() {
    this.counter += 1
  }

  @action changeName(name) {
    this.name = name
  }

  toJson() {
    return {
      counter: this.counter,
      name: this.name,
    }
  }
}
