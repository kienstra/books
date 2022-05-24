import { Container } from 'inversify'
import { UserModel } from './Authentication/UserModel'
import { BooksRepository } from './Books/BooksRepository'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { NavigationRepository } from './Navigation/NavigationRepository'
import { RouterRepository } from './Routing/RouterRepository'

export class BaseIOC {
  container

  constructor() {
    this.container = new Container({
      autoBindInjectable: true,
      defaultScope: 'Transient'
    })
  }

  buildBaseTemplate = () => {
    this.container.bind(MessagesRepository).to(MessagesRepository).inSingletonScope()
    this.container.bind(RouterRepository).to(RouterRepository).inSingletonScope()
    this.container.bind(NavigationRepository).to(NavigationRepository).inSingletonScope()
    this.container.bind(BooksRepository).to(BooksRepository).inSingletonScope()
    this.container.bind(UserModel).to(UserModel).inSingletonScope()
    return this.container
  }
}
