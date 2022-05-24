import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from './Core/Providers/Injection'
import { AppPresenter } from './AppPresenter'
import { NavigationComponent } from './Navigation/NavigationComponent'
import { HomeComponent } from './Home/HomeComponent'
import { LoginRegisterComponent } from './Authentication/LoginRegisterComponent'
import { useValidation } from './Core/Providers/Validation'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { AuthorsComponent } from './Authors/AuthorsComponent'
import { BooksComponent } from './Books/BooksComponent'

export const AppComp = observer((props) => {
  const [, updateClientValidationMessages] = useValidation()

  React.useEffect(() => {
    props.presenter.load(onRouteChange)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function onRouteChange() {
    updateClientValidationMessages([])
  }

  const renderedComponents = [
    {
      id: 'homeLink',
      component: <HomeComponent key="homePage" />
    },
    {
      id: 'booksLink',
      component: <BooksComponent key="booksLink" />
    },
    {
      id: 'authorsLink',
      component: <AuthorsComponent key="authorsLink" />
    }
  ]

  return (
    <div className="container">
      {props.presenter.currentRoute.routeId === 'loginLink' ? (
        <>
          <LoginRegisterComponent />
        </>
      ) : (
        <div className="w3-row">
          <div className="w3-col s4 w3-center">
            <NavigationComponent />
          </div>
          <div className="w3-col s8 w3-left">
            {renderedComponents.map((current) => {
              return props.presenter.currentRoute.routeId === current.id && current.component
            })}
          </div>
        </div>
      )}
    </div>
  )
})

export const AppComponent = withInjection({
  presenter: AppPresenter,
  messagesRepository: MessagesRepository
})(AppComp)
