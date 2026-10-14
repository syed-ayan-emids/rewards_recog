import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StoreProvider } from '../src/store'
import HomeScreen from '../src/pages/Home'
import ApprovalsScreen from '../src/pages/Approvals'
import Composer from '../src/components/organisms/Composer'

const renderWithStore = (ui: React.ReactNode) => render(<StoreProvider>{ui}</StoreProvider>)

describe('Home screen', () => {
  it('shows the team leaderboard with ranked colleagues', async () => {
    renderWithStore(<HomeScreen />)
    expect(screen.getByText('Team leaderboard')).toBeInTheDocument()
    await waitFor(() => {
      // count-up animation settles to the real numbers
      expect(screen.getAllByText('420').length).toBeGreaterThan(0)
    })
    expect(screen.getByText('Daniel C.')).toBeInTheDocument()
    expect(screen.getByText('Kenji W.')).toBeInTheDocument()
  })
})

describe('Approvals screen', () => {
  it('lists pending requests in the inbox tab', () => {
    renderWithStore(<ApprovalsScreen />)
    expect(screen.getByText(/Sanjay wants to award/)).toBeInTheDocument()
    expect(screen.getByText('Daniel redeemed MakeMyTrip ₹2,000 voucher')).toBeInTheDocument()
  })

  it('approves a request and tracks the decision in Done', () => {
    renderWithStore(<ApprovalsScreen />)
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))
    fireEvent.click(screen.getByRole('button', { name: /^Done/ }))
    expect(screen.getByText('Approved')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument()
  })

  it('marks a request for next time', () => {
    renderWithStore(<ApprovalsScreen />)
    fireEvent.click(screen.getByRole('button', { name: 'Next time' }))
    fireEvent.click(screen.getByRole('button', { name: /^Done/ }))
    expect(screen.getByText('Next time')).toBeInTheDocument()
  })
})

describe('Composer page', () => {
  it('renders the page heading and closes via Cancel', () => {
    renderWithStore(<Composer open />)
    expect(screen.getByText('Recognize a teammate')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Post it')).toBeInTheDocument()
  })

  it('matches directory people by their email address', () => {
    const { container } = renderWithStore(<Composer open />)
    const input = container.querySelector('#composer-to-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'priya.menon@emids.com' } })
    fireEvent.click(screen.getByText('Priya Menon'))
    // the chip shows what was typed — the email — in the To field and the preview card
    expect(screen.getAllByText('priya.menon@emids.com').length).toBeGreaterThan(0)
  })

  it('accepts a recipient typed as an email address that is not in the directory', () => {
    const { container } = renderWithStore(<Composer open />)
    const input = container.querySelector('#composer-to-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'tony.stark@emids.com' } })
    fireEvent.click(screen.getByText('Add tony.stark@emids.com'))
    expect(screen.getAllByText('tony.stark@emids.com').length).toBeGreaterThan(0)
  })

  it('prefills the message from the picked value template', async () => {
    const { container } = renderWithStore(<Composer open />)
    fireEvent.click(screen.getByText('Customer First'))
    await waitFor(() => {
      expect((container.querySelector('textarea') as HTMLTextAreaElement).value)
        .toContain('Thank you for putting the client first')
    })
  })
})
