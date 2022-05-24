import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagesRepository } from '../Core/Messages/MessagesRepository'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
export class BooksRepository {
  baseUrl

  @inject(Types.IDataGateway)
  dataGateway

  @inject(UserModel)
  userModel

  @inject(Config)
  config

  @inject(MessagesRepository)
  messagesRepository

  messagePm = 'UNSET'

  booksPm = null

  constructor() {
    makeObservable(this, { messagePm: observable, booksPm: observable })
  }

  async load() {
    const response = await this.dataGateway.get(`/books?emailOwnerId=${this.userModel.email}`, {
      emailOwnerId: this.userModel.email
    })

    if (response.success && response.result?.length) {
      this.booksPm = response.result.map((book) => {
        return {
          name: book.name,
          emailOwnerId: book.emailOwnerId,
          devOwnerId: book.devOwnerId
        }
      })
    } else {
      this.booksPm = null
    }
  }

  reset() {
    this.messagePm = 'RESET'
  }

  async addBook(name) {
    const response = await this.dataGateway.post('/books', { name, emailOwnerId: this.userModel.email })
    this.messagesRepository.addMessage(MessagePacking.unpackServerDtoToPm(response).serverMessage)
  }
}
