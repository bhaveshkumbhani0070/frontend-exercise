import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import StartPage from '../pages/StartPage'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

describe('StartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('renders title, input, select, and best time', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Memory Game')).toBeInTheDocument()
    expect(screen.getByLabelText('Player Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByLabelText('Select Board Size (rows × columns)')).toBeInTheDocument()
    const bestTimeDiv = screen.getByText('Best time:').closest('div')
    expect(bestTimeDiv).toHaveTextContent('Best time: —')
  })

  test('start button disabled until name is entered', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    )
    const btn = screen.getByRole('button', { name: /start/i })
    expect(btn).toBeDisabled()
    const input = screen.getByPlaceholderText(/your name/i)
    fireEvent.change(input, { target: { value: 'Alex' } })
    expect(btn).toBeEnabled()
  })

  test('updates board size selection', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    )
    const select = screen.getByLabelText('Select Board Size (rows × columns)')
    fireEvent.change(select, { target: { value: '4x5' } })
    expect(select).toHaveValue('4x5')
  })

  test('navigates to game page with correct params on start', () => {
    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    )
    const input = screen.getByPlaceholderText('Your name')
    const select = screen.getByLabelText('Select Board Size (rows × columns)')
    const btn = screen.getByRole('button', { name: /start/i })

    fireEvent.change(input, { target: { value: 'Alex' } })
    fireEvent.change(select, { target: { value: '4x5' } })
    fireEvent.click(btn)

    expect(mockNavigate).toHaveBeenCalledWith('/game?name=Alex&rows=4&cols=5')
  })

  test('displays best time from localStorage', () => {
    localStorage.setItem('memory_best', '42')
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    )
    const bestTimeDiv = screen.getByText('Best time:').closest('div')
    expect(bestTimeDiv).toHaveTextContent('Best time: 42s')
  })
})
