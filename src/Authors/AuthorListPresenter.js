import { injectable, inject } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { AuthorsRepository } from './AuthorsRepository'

@injectable()
export class BookListPresenter {
  @inject(AuthorsRepository)
  authorsRepository

  constructor() {
    makeObservable(this, {
      viewModel: computed
    })
  }

  get viewModel() {
    return this.authorsRepository.authorsPm?.map((author) => {
      return author
    })
  }

}