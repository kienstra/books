import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { Router } from '../Routing/Router'
import { RouterRepository } from '../Routing/RouterRepository'
import { LoginRegisterPresenter } from './LoginRegisterPresenter'
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub'
import { GetFailedRegistrationStub } from '../TestTools/GetFailedRegistrationStub'
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub'
import { GetFailedUserLoginStub } from '../TestTools/GetFailedUserLoginStub'

let appTestHarness = null
let router = null
let routerRepository = null
let routerGateway = null
let dataGateway = null
let onRouteChange = null
let loginRegisterPresenter = null

describe('init', () => {
  beforeEach(() => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    router = appTestHarness.container.get(Router)
    routerRepository = appTestHarness.container.get(RouterRepository)
    routerGateway = appTestHarness.container.get(Types.IRouterGateway)
    dataGateway = appTestHarness.container.get(Types.IDataGateway)
    loginRegisterPresenter = appTestHarness.container.get(LoginRegisterPresenter)

    onRouteChange = () => {}
  })

  it('should be an null route', () => {
    expect(routerRepository.currentRoute.routeId).toBe(null)
  })

  describe('bootstrap', () => {
    beforeEach(() => {
      appTestHarness.bootStrap(onRouteChange)
    })

    it('should start at null route', () => {
      expect(routerRepository.currentRoute.routeId).toBe(null)
    })

    describe('routing', () => {
      it('should block wildcard *(default) routes when not logged in', async () => {
        await router.goToId('default')

        expect(routerGateway.goToId).toHaveBeenLastCalledWith('loginLink')
      })

      it('should block secure routes when not logged in', async () => {
        await router.goToId('homeLink')

        expect(routerGateway.goToId).toHaveBeenLastCalledWith('loginLink')
      })

      it('should allow public route when not logged in', async () => {
        await router.goToId('authorPolicyLink')

        expect(routerGateway.goToId).toHaveBeenLastCalledWith('authorPolicyLink')
      })
    })

    describe('register', () => {
      it('should show successful user message on successful register', async () => {
        dataGateway.post = jest.fn().mockImplementation(() => {
          return Promise.resolve(GetSuccessfulRegistrationStub())
        })

        await loginRegisterPresenter.register()

        expect(loginRegisterPresenter.showValidationWarning).toBe(false)
        expect(loginRegisterPresenter.messages).toEqual(['User registered'])
      })

      it('should show failed server message on failed register', async () => {
        dataGateway.post = jest.fn().mockImplementation(() => {
          return Promise.resolve(GetFailedRegistrationStub())
        })

        await loginRegisterPresenter.register()

        expect(loginRegisterPresenter.showValidationWarning).toBe(true)
        expect(loginRegisterPresenter.messages).toEqual([GetFailedRegistrationStub().result.message])
      })
    })

    describe('login', () => {
      it('should start at loginLink ', async () => {
        await router.goToId('homeLink')
        expect(routerRepository.currentRoute.routeId).toBe('loginLink')
      })

      it('should go to homeLink on successful login (and populate userModel)', async () => {
        await appTestHarness.setupLogin(GetSuccessfulUserLoginStub)

        expect(routerRepository.currentRoute.routeId).toBe('homeLink')
        expect(router.userModel).toEqual({
          email: appTestHarness.stubEmail,
          token: GetSuccessfulUserLoginStub().result.token
        })
      })

      it('should update private route when successful login', async () => {
        expect(routerRepository.currentRoute.routeId).toBe(null)

        await appTestHarness.setupLogin(GetSuccessfulUserLoginStub)
        expect(routerGateway.goToId).toHaveBeenLastCalledWith('homeLink')
      })

      it('should not update route when failed login', async () => {
        await appTestHarness.setupLogin(GetFailedUserLoginStub)
        expect(routerGateway.goToId).not.toHaveBeenCalled()
      })

      it('should show failed user message on failed login', async () => {
        await appTestHarness.setupLogin(GetFailedUserLoginStub)

        expect(loginRegisterPresenter.showValidationWarning).toBe(true)
        expect(loginRegisterPresenter.messages).toEqual(['Failed: no user record.'])
      })

      it('should clear messages on route change', async () => {
        await appTestHarness.setupLogin(GetFailedUserLoginStub)

        // anchor
        expect(loginRegisterPresenter.messages).toEqual([GetFailedUserLoginStub().result.message])

        await router.goToId('default')
        expect(loginRegisterPresenter.messages).toEqual([])
      })

      it('should logout', async () => {
        await appTestHarness.setupLogin(GetSuccessfulUserLoginStub)

        // anchor
        expect(router.userModel).toEqual({
          email: appTestHarness.stubEmail,
          token: GetSuccessfulUserLoginStub().result.token
        })

        await loginRegisterPresenter.logOut()

        expect(router.userModel).toEqual({
          email: '',
          token: ''
        })
        expect(routerRepository.currentRoute.routeId).toBe('loginLink')
      })
    })
  })
})
