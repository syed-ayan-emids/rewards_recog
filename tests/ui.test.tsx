import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Avatar, Btn, Card, Modal, Segmented, Ring } from '../src/components/atoms'

describe('Avatar', () => {
  it('shows the person initials', () => {
    render(<Avatar id="p3" />)
    expect(screen.getByText('PM')).toBeInTheDocument()
  })

  it('marks online people when big enough', () => {
    render(<Avatar id="p3" size={40} />)
    expect(screen.getByLabelText('online')).toBeInTheDocument()
  })
})

describe('Btn', () => {
  it('renders its label and respects disabled', () => {
    render(<Btn disabled>Post it</Btn>)
    const btn = screen.getByText('Post it').closest('button')
    expect(btn).toBeDisabled()
  })

  it('applies the variant class', () => {
    render(<Btn variant="gold">Reward</Btn>)
    const btn = screen.getByText('Reward').closest('button')
    expect(btn!.className).toContain('bg-gold')
  })
})

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p data-testid="inside">hi</p></Card>)
    expect(screen.getByTestId('inside')).toBeInTheDocument()
  })
})

describe('Modal', () => {
  it('only renders when open', () => {
    const { rerender, unmount } = render(
      <Modal open={false} onClose={() => {}}>
        <div>body</div>
      </Modal>,
    )
    expect(screen.queryByText('body')).not.toBeInTheDocument()
    rerender(
      <Modal open onClose={() => {}}>
        <div>body</div>
      </Modal>,
    )
    expect(screen.getByText('body')).toBeInTheDocument()
    unmount()
  })

  it('closes on Escape and on backdrop click', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        <div>body</div>
      </Modal>,
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('dialog').firstElementChild!)
    expect(onClose).toHaveBeenCalledTimes(2)
    cleanup()
  })
})

describe('Segmented', () => {
  it('fires onChange for the clicked option', () => {
    const onChange = vi.fn()
    render(
      <Segmented
        options={[{ key: 'a', label: 'Alice' }, { key: 'b', label: 'Bob' }]}
        value="a"
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByText('Bob'))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})

describe('Ring', () => {
  it('renders centered content', () => {
    render(<Ring pct={80}><span>81%</span></Ring>)
    expect(screen.getByText('81%')).toBeInTheDocument()
  })
})
