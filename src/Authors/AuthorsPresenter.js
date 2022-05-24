import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { AuthorsRepository } from './AuthorsRepository'

@injectable()
export class AuthorsPresenter {
  @inject(AuthorsRepository)
  authorsRepository

  newBookName = null

  lastAddedBookName = null

  constructor() {
    makeObservable(this, { viewModel: computed, lastAddedBookName: observable, newBookName: observable })
  }

  get viewModel() {
    return this.authorsRepository.messagePm
  }

  async addAuthor() {
    await this.authorsRepository.addAuthor(this.newAuthorName)
    await this.authorsRepository.load()
  }
}
