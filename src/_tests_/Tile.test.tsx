import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tile from '../components/Tile'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

describe('Tile Component', () => {
  const mockOnClick = vi.fn()
  const tile = {
    id: '1-plant01',
    image: '/plant01.jpg',
    matched: false,
    flipped: false
  }
  const props = {
    tile,
    back: '/growy_logo.svg',
    onClick: mockOnClick
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders back image when not flipped or matched', () => {
    render(<Tile {...props} />)
    const backImageDiv = screen.getByRole('button').querySelector('div:has(img[alt="back"])')
    const frontImageDiv = screen.getByRole('button').querySelector('div:has(img[alt="front"])')
    expect(backImageDiv).toHaveClass('rotate-y-0')
    expect(frontImageDiv).toHaveClass('rotate-y-180')
  })

  test('renders front image when flipped', () => {
    render(<Tile {...props} tile={{ ...tile, flipped: true }} />)
    const frontImageDiv = screen.getByRole('button').querySelector('div:has(img[alt="front"])')
    const backImageDiv = screen.getByRole('button').querySelector('div:has(img[alt="back"])')
    expect(frontImageDiv).toHaveClass('rotate-y-0')
    expect(backImageDiv).toHaveClass('rotate-y-180')
  })

  test('renders front image when matched', () => {
    render(<Tile {...props} tile={{ ...tile, matched: true }} />)
    const frontImageDiv = screen.getByRole('button').querySelector('div:has(img[alt="front"])')
    const backImageDiv = screen.getByRole('button').querySelector('div:has(img[alt="back"])')
    expect(frontImageDiv).toHaveClass('rotate-y-0')
    expect(backImageDiv).toHaveClass('rotate-y-180')
  })

  test('calls onClick when clicked and not disabled', async () => {
    const user = userEvent.setup()
    render(<Tile {...props} />)
    const button = screen.getByRole('button')
    await user.click(button)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled (flipped)', async () => {
    const user = userEvent.setup()
    render(<Tile {...props} tile={{ ...tile, flipped: true }} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.click(button)
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  test('does not call onClick when disabled (matched)', async () => {
    const user = userEvent.setup()
    render(<Tile {...props} tile={{ ...tile, matched: true }} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.click(button)
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  test('has correct aria-pressed attribute', () => {
    const { rerender } = render(<Tile {...props} tile={{ ...tile, flipped: false, matched: false }} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    rerender(<Tile {...props} tile={{ ...tile, flipped: true, matched: false }} />)
    expect(button).toHaveAttribute('aria-pressed', 'true')

    rerender(<Tile {...props} tile={{ ...tile, flipped: false, matched: true }} />)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })
})
