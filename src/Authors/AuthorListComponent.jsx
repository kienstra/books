import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorListPresenter } from './AuthorListPresenter'

const AuthorListComp = observer((props) => {
  return (
    <>
      {props.presenter.viewModel?.map((book, i) => {
        return <div key={i}>{book.visibleName}</div>
      })}
      <br />
    </>
  )
})

export const AuthorListComponent = withInjection({presenter: AuthorListPresenter})(AuthorListComp)
