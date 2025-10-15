import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import GamePage from '../pages/GamePage'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useSearchParams: vi.fn()
  }
})

vi.mock('../utils/useTimer', () => ({
  useTimer: vi.fn()
}))

describe('GamePage Component', () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams({ name: 'Alex', rows: '2', cols: '2' }), vi.fn()])
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders player name, time, and moves', () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Player')).toBeInTheDocument()
    expect(screen.getByText('Alex')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('0s')).toBeInTheDocument()
    expect(screen.getByText('Moves: 0')).toBeInTheDocument()
  })

  test('renders correct number of tiles for 2x2 board', () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )
    const grid = screen.getByTestId('game-board')
    const tiles = grid.querySelectorAll('button')
    expect(tiles).toHaveLength(4)
  })

  test('flips tile on click', async () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )
    const tiles = screen.getAllByRole('button')
    const tile = tiles[0]
    const backImageDiv = tile.querySelector('div:has(img[alt="back"])')
    const frontImageDiv = tile.querySelector('div:has(img[alt="front"])')
    expect(backImageDiv).toHaveClass('rotate-y-0')
    expect(frontImageDiv).toHaveClass('rotate-y-180')
    fireEvent.click(tile)
    await waitFor(() => {
      expect(frontImageDiv).toHaveClass('rotate-y-0')
      expect(backImageDiv).toHaveClass('rotate-y-180')
      expect(tile).toHaveAttribute('aria-pressed', 'true')
    })
  })

  test('increments moves on pair attempt', async () => {
    vi.mock('../utils/shuffle', () => ({
      shuffle: vi.fn().mockReturnValue(['/plant01.jpg', '/plant02.jpg', '/plant01.jpg', '/plant02.jpg'])
    }))

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )
    const tiles = screen.getAllByRole('button')
    expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    fireEvent.click(tiles[0]) // First tile
    fireEvent.click(tiles[1]) // Second tile
    await waitFor(
      () => {
        expect(screen.getByText('Moves: 1')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  })

  test('updates best time in localStorage on game completion', async () => {
    vi.mock('../utils/shuffle', () => ({
      shuffle: vi.fn().mockReturnValue(['/plant01.jpg', '/plant01.jpg', '/plant02.jpg', '/plant02.jpg'])
    }))

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )
    const tiles = screen.getAllByRole('button')
    fireEvent.click(tiles[0]) // First tile of first pair
    fireEvent.click(tiles[1]) // Second tile of first pair
    fireEvent.click(tiles[2]) // First tile of second pair
    fireEvent.click(tiles[3]) // Second tile of second pair
    await waitFor(() => {
      expect(localStorage.getItem('memory_best')).toBe('0')
    })
  })
})
