import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub'
import { SingleBooksResultStub } from '../TestTools/SingleBooksResultStub'
import { GetSuccessfulBookAddedStub } from '../TestTools/GetSuccessfulBookAddedStub'
import { BooksPresenter } from './BooksPresenter'
import { BookListPresenter } from './BookListPresenter'
import { BooksRepository } from './BooksRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

let appTestHarness = null
let httpGateway = null
let booksPresenter = null
let bookListPresenter = null
let booksRepository = null

const newBookName = 'The Odyssey'

describe('books', () => {
  beforeEach(async () => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    appTestHarness.bootStrap(() => {})

    appTestHarness.container.bind(BookListPresenter).to(BookListPresenter).inSingletonScope()
    httpGateway = appTestHarness.container.get(Types.IDataGateway)
    booksRepository = appTestHarness.container.get(BooksRepository)
    booksPresenter = appTestHarness.container.get(BooksPresenter)
    bookListPresenter = appTestHarness.container.get(BookListPresenter)
  })

  describe('loading', () => {
    it('should show book list', async () => {
      httpGateway.get = jest.fn().mockImplementationOnce(() => {
        return Promise.resolve(SingleBooksResultStub())
      })
      await booksRepository.load()

      expect(bookListPresenter.viewModel[0].visibleName).toEqual('Wind in the willows')
      expect(bookListPresenter.viewModel[3].visibleName).toEqual('Wind In The Willows 2')
    })
  })

  describe('adding a book', () => {
    beforeEach(async () => {
      await appTestHarness.setupLogin(GetSuccessfulUserLoginStub)

      httpGateway.post = jest.fn().mockImplementationOnce(() => {
        return Promise.resolve(GetSuccessfulBookAddedStub())
      })
      booksPresenter.newBookName = newBookName
      await booksPresenter.addBook()
    })

    it('should make a request to add the book', async () => {
      expect(httpGateway.post).toHaveBeenLastCalledWith('/books', {
        name: newBookName,
        emailOwnerId: appTestHarness.stubEmail
      })
    })

    it('should show the last book added', async () => {
      expect(booksPresenter.lastAddedBookName).toBe(newBookName)
    })

    it('should show the message', () => {
      expect(appTestHarness.container.get(MessagesPresenter).messages).toEqual(['Book Added'])
    })
  })

  describe('saving', () => {
    beforeEach(async () => {})

    it('should reload books list', async () => {})

    it('should update books message', async () => {})
  })
})
