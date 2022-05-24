import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { isBoxedObservable, makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagesRepository } from '../Core/Messages/MessagesRepository'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
export class AuthorsRepository {
  @inject(Types.IDataGateway)
  dataGateway

  @inject(UserModel)
  userModel

  @inject(Config)
  Config

  @inject(MessagesRepository)
  messagesRepository

  authorsPm = null

  constructor() {
    makeObservable(this, { messagePm: observable, booksPm: observable })
  }

  async load() {
    const response = await this.dataGateway.get(`/allbooks?emailOwnerId=${this.userModel.email}`, {
      emailOwnerId: this.userModel.email
    })

    if (response.success && response.result?.length) {
      this.authorsPm = response.result.reduce((accumulator) => {
        return accumulator
      }, {})
    }
  }
}
