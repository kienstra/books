import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { BooksRepository } from './BooksRepository'

@injectable()
export class BooksPresenter {
  @inject(BooksRepository)
  booksRepository

  newBookName = null

  lastAddedBookName = null

  constructor() {
    makeObservable(this, { viewModel: computed, lastAddedBookName: observable, newBookName: observable })
  }

  get viewModel() {
    return this.booksRepository.messagePm
  }

  reset() {
    this.newBookName = ''
  }

  async addBook() {
    this.lastAddedBookName = this.newBookName
    await this.booksRepository.addBook(this.newBookName)
    await this.booksRepository.load()
  }
}
