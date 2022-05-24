import { injectable, inject } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { BooksRepository } from './BooksRepository'

@injectable()
export class BookListPresenter {
  @inject(BooksRepository)
  booksRepository

  constructor() {
    makeObservable(this, {
      viewModel: computed
    })
  }

  get viewModel() {
    return this.booksRepository.booksPm?.map((book) => {
      return { visibleName: book.name }
    })
  }
}
