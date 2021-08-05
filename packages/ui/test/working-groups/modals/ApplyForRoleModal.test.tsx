import { registry } from '@joystream/types'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'
import { interpret } from 'xstate'

import { AccountsContext } from '@/accounts/providers/accounts/context'
import { UseAccounts } from '@/accounts/providers/accounts/provider'
import { getSteps } from '@/common/model/machines/getSteps'
import { ApiContext } from '@/common/providers/api/context'
import { ModalContext } from '@/common/providers/modal/context'
import { UseModal } from '@/common/providers/modal/types'
import { MembershipContext } from '@/memberships/providers/membership/context'
import { MyMemberships } from '@/memberships/providers/membership/provider'
import { seedMembers } from '@/mocks/data'
import { seedWorkingGroups } from '@/mocks/data/seedWorkingGroups'
import { ApplyForRoleModal } from '@/working-groups/modals/ApplyForRoleModal'
import { applyForRoleMachine } from '@/working-groups/modals/ApplyForRoleModal/machine'
import { WorkingGroupOpeningFieldsFragment } from '@/working-groups/queries'
import { asWorkingGroupOpening } from '@/working-groups/types'

import { seedOpening, seedOpeningStatuses } from '../../../src/mocks/data/seedOpenings'
import { getButton } from '../../_helpers/getButton'
import { selectAccount } from '../../_helpers/selectAccount'
import { alice, bob } from '../../_mocks/keyring'
import { getMember } from '../../_mocks/members'
import { MockKeyringProvider, MockQueryNodeProviders } from '../../_mocks/providers'
import { setupMockServer } from '../../_mocks/server'
import { OPENING_DATA } from '../../_mocks/server/seeds'
import {
  stubApi,
  stubDefaultBalances,
  stubTransaction,
  stubTransactionFailure,
  stubTransactionSuccess,
} from '../../_mocks/transactions'

const useHasRequiredStake = { hasRequiredStake: true }

jest.mock('../../../src/accounts/hooks/useHasRequiredStake', () => {
  return {
    useHasRequiredStake: () => useHasRequiredStake,
  }
})

describe('UI: ApplyForRoleModal', () => {
  const api = stubApi()
  const useModal: UseModal<any> = {
    hideModal: jest.fn(),
    showModal: jest.fn(),
    modal: null,
    modalData: undefined,
  }
  const useMyMemberships: MyMemberships = {
    active: undefined,
    members: [],
    setActive: (member) => (useMyMemberships.active = member),
    isLoading: false,
    hasMembers: true,
  }

  let useAccounts: UseAccounts
  let tx: any
  let bindAccountTx: any

  const server = setupMockServer({ noCleanupAfterEach: true })

  beforeAll(async () => {
    await cryptoWaitReady()
    jest.spyOn(console, 'log').mockImplementation()

    seedMembers(server.server)
    seedWorkingGroups(server.server)
    seedOpeningStatuses(server.server)
    seedOpening(OPENING_DATA, server.server)

    useAccounts = {
      hasAccounts: true,
      allAccounts: [alice, bob],
    }
  })

  beforeEach(async () => {
    const fields = (server.server?.schema.first('WorkingGroupOpening') as unknown) as WorkingGroupOpeningFieldsFragment
    const opening = asWorkingGroupOpening(fields)
    useModal.modalData = { opening }
    useMyMemberships.setActive(getMember('alice'))

    stubDefaultBalances(api)
    tx = stubTransaction(api, 'api.tx.forumWorkingGroup.applyOnOpening')
    bindAccountTx = stubTransaction(api, 'api.tx.members.addStakingAccountCandidate', 42)
  })

  describe('Steps', () => {
    const service = interpret(applyForRoleMachine)
    service.start()

    expect(getSteps(service)).toEqual([
      { title: 'Stake', type: 'next' },
      { title: 'Form', type: 'next' },
      { title: 'Submit application', type: 'next' },
    ])
  })

  describe('Requirements', () => {
    it('No active member', async () => {
      useMyMemberships.active = undefined

      renderModal()

      expect(useModal.showModal).toBeCalledWith({ modal: 'SwitchMember' })
    })

    it('Insufficient funds', async () => {
      tx = stubTransaction(api, 'api.tx.forumWorkingGroup.applyOnOpening', 10_000)

      renderModal()

      expect(await screen.findByText('Insufficient Funds')).toBeDefined()
    })
  })

  it('Renders a modal', async () => {
    renderModal()

    expect(await screen.findByText('Applying for role')).toBeDefined()
  })

  describe('Stake step', () => {
    it('Empty fields', async () => {
      renderModal()

      const button = await getNextStepButton()
      expect(button).toBeDisabled()
    })

    it('Too low stake', async () => {
      renderModal()

      await selectAccount('Select account for Staking', 'alice')
      const input = await screen.findByLabelText(/Select amount for staking/i)
      fireEvent.change(input, { target: { value: '50' } })

      const button = await getNextStepButton()
      expect(button).toBeDisabled()
    })

    it('Valid fields', async () => {
      renderModal()

      await selectAccount('Select account for Staking', 'alice')
      const input = await screen.findByLabelText(/Select amount for staking/i)
      fireEvent.change(input, { target: { value: '2000' } })

      const button = await getNextStepButton()
      expect(button).not.toBeDisabled()
    })
  })

  describe('Application form step', () => {
    beforeEach(async () => {
      await renderModal()
      await fillAndSubmitStakeStep()
    })

    it('Form questions', async () => {
      expect(await screen.findByLabelText(/Question 1/i)).toBeDefined()
      expect(await screen.findByLabelText(/Question 2/i)).toBeDefined()
      expect(await screen.findByLabelText(/Question 3/i)).toBeDefined()
    })

    it('Empty form', async () => {
      expect(await getNextStepButton()).toBeDisabled()
    })

    it('Valid fields', async () => {
      fireEvent.change(await screen.findByLabelText(/Question 1/i), { target: { value: 'Foo bar baz' } })
      fireEvent.change(await screen.findByLabelText(/Question 2/i), { target: { value: 'Foo bar baz' } })
      fireEvent.change(await screen.findByLabelText(/Question 3/i), { target: { value: 'Foo bar baz' } })

      const button = await getNextStepButton()
      expect(button).not.toBeDisabled()
    })
  })

  describe('Authorize', () => {
    async function fillSteps() {
      await renderModal()
      await fillAndSubmitStakeStep()

      fireEvent.change(await screen.findByLabelText(/Question 1/i), { target: { value: 'Foo bar baz' } })
      fireEvent.change(await screen.findByLabelText(/Question 2/i), { target: { value: 'Foo bar baz' } })
      fireEvent.change(await screen.findByLabelText(/Question 3/i), { target: { value: 'Foo bar baz' } })
      fireEvent.click(await getNextStepButton())
    }

    describe('Staking account is not bound yet', () => {
      it('Bind account step', async () => {
        await fillSteps()

        expect(await screen.findByText('You intend to bind account for staking')).toBeDefined()
        expect((await screen.findByText(/^Transaction fee:/i))?.nextSibling?.textContent).toBe('42')
      })

      it('Bind account failure', async () => {
        stubTransactionFailure(bindAccountTx)
        await fillSteps()

        fireEvent.click(screen.getByText(/^Sign transaction/i))

        expect(await screen.findByText('Failure')).toBeDefined()
      })

      it('Apply on opening step', async () => {
        stubTransactionSuccess(bindAccountTx, [], 'members', '')
        await fillSteps()

        fireEvent.click(screen.getByText(/^Sign transaction/i))

        expect(await screen.findByText(/You intend to apply for a role/i)).toBeDefined()
        expect((await screen.findByText(/^Transaction fee:/i))?.nextSibling?.textContent).toBe('25')
      })

      it('Apply on opening success', async () => {
        stubTransactionSuccess(bindAccountTx, [], 'members', '')
        stubTransactionSuccess(
          tx,
          ['EventParams', registry.createType('ApplicationId', 1337)],
          'workingGroup',
          'AppliedOnOpening'
        )
        await fillSteps()
        fireEvent.click(screen.getByText(/^Sign transaction/i))

        fireEvent.click(screen.getByText(/^Sign transaction/i))

        expect(await screen.findByText('Application submitted!')).toBeDefined()
        expect(await screen.findByText(/application id: 1337/i)).toBeDefined()
      })

      it('Apply on opening failure', async () => {
        stubTransactionSuccess(bindAccountTx, [], 'members', '')
        stubTransactionFailure(tx)
        await fillSteps()
        fireEvent.click(screen.getByText(/^Sign transaction/i))

        fireEvent.click(screen.getByText(/^Sign transaction/i))

        expect(await screen.findByText('Failure')).toBeDefined()
      })
    })
  })

  async function getNextStepButton() {
    return getButton(/Next step/i)
  }

  async function fillAndSubmitStakeStep() {
    await selectAccount('Select account for Staking', 'alice')
    const input = await screen.findByLabelText(/Select amount for staking/i)
    fireEvent.change(input, { target: { value: '2000' } })
    fireEvent.click(await getNextStepButton())
    await screen.findByText('Application')
  }

  function renderModal() {
    return render(
      <MemoryRouter>
        <ModalContext.Provider value={useModal}>
          <MockQueryNodeProviders>
            <MockKeyringProvider>
              <AccountsContext.Provider value={useAccounts}>
                <MembershipContext.Provider value={useMyMemberships}>
                  <ApiContext.Provider value={api}>
                    <ApplyForRoleModal />
                  </ApiContext.Provider>
                </MembershipContext.Provider>
              </AccountsContext.Provider>
            </MockKeyringProvider>
          </MockQueryNodeProviders>
        </ModalContext.Provider>
      </MemoryRouter>
    )
  }
})
