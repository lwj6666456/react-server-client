import {
  observable,
  computed,
  autorun,
  action,
} from 'mobx'

export default class AppState {
  @observable counter = 0

  @observable name = '张三'

  @computed get msg() {
    return `${this.name} 说 ${this.counter}`
  }

  @action add() {
    this.counter += 1
  }

  @action changeName(name) {
    this.name = name
  }
}

const appState = new AppState()

autorun(() => {
  console.log(appState.msg)
})

setInterval(() => {
  appState.add()
}, 1000)
