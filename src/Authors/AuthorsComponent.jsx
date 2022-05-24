import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorListComponent } from './AuthorListComponent'
import { AddAuthorComponent } from './AddAuthorComponent'
import { AddBooksComponent } from '../Books/AddBooksComponent'
import { BookListComponent } from '../Books/BookListComponent'
import { AuthorsPresenter } from './AuthorsPresenter'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { useValidation } from '../Core/Providers/Validation'

const AuthorsComp = observer((props) => {
  const [, updateClientValidationMessages] = useValidation()
  let formValid = () => {
    const clientValidationMessages = []
    if (props.presenter.newAuthorName === '') clientValidationMessages.push('No author name')
    updateClientValidationMessages(clientValidationMessages)

    return clientValidationMessages.length === 0
  }

  React.useEffect(() => {
    props.presenter.load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h1>AUTHORS</h1>
      <input
        value="show author list"
        type="button"
        onClick={props.presenter.toggleShowBooks}
      />
      <br />
      <AuthorListComponent />
      <br />
      <AddAuthorComponent formValid={formValid} />
      <br />
      <AddBooksComponent presenter={props.presenter} formValid={formValid} />
      <br />
      <BookListComponent />
      <br />
      <MessagesComponent />
    </>
  )
})

export const AuthorsComponent = withInjection({})(AuthorsComp)
