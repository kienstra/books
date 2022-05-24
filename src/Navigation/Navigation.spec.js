import { NavigationPresenter } from './NavigationPresenter'
import { Router } from '../Routing/Router'
import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub'

let appTestHarness = null
let navigationPresenter = null

describe('navigation', () => {
  beforeEach(async () => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    appTestHarness.bootStrap(() => {})
    navigationPresenter = appTestHarness.container.get(NavigationPresenter)
  })

  describe('before login', () => {
    it('anchor default state', () => {
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('')
      expect(navigationPresenter.viewModel.showBack).toBe(false)
      expect(navigationPresenter.viewModel.menuItems).toEqual([])
    })
  })

  describe('login', () => {
    beforeEach(async () => {
      await appTestHarness.setupLogin(GetSuccessfulRegistrationStub, 'login')
    })

    it('should navigate down the navigation tree', async () => {
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > homeLink')
      await appTestHarness.router.goToId('authorsLink')

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > authorsLink')

      await appTestHarness.router.goToId('authorsLink-authorPolicyLink')

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Author Policy > authorsLink-authorPolicyLink'
      )
    })

    it('should move back twice', async () => {
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > homeLink')
      await appTestHarness.router.goToId('authorsLink')
      await appTestHarness.router.goToId('authorsLink-authorPolicyLink')

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Author Policy > authorsLink-authorPolicyLink'
      )

      navigationPresenter.back()
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Authors > authorsLink'
      )

      navigationPresenter.back()
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Home > homeLink'
      )
    })
  })
})
