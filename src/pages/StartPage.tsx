import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type BoardSize = { rows: number; cols: number }
const boardSizes = [
  { rows: 2, cols: 2, label: '2x2' },
  { rows: 4, cols: 4, label: '4x4' },
  { rows: 4, cols: 5, label: '4x5' },
  { rows: 6, cols: 6, label: '6x6' }
]

export default function StartPage() {
  const [name, setName] = useState('')
  const [boardSize, setBoardSize] = useState<BoardSize>({ rows: 4, cols: 4 })
  const navigate = useNavigate()

  function start() {
    const params = new URLSearchParams({ name, rows: String(boardSize.rows), cols: String(boardSize.cols) })
    navigate(`/game?${params.toString()}`)
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50'>
      <div className='w-full max-w-md rounded bg-white p-6 shadow-md'>
        <h1 className='mb-4 text-2xl font-semibold'>Memory Game</h1>
        <label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='player-name'>
          Player Name
        </label>
        <input
          id='player-name'
          aria-label='Enter your name'
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          className='mb-4 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Your name'
        />
        <label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='board-size'>
          Select Board Size (rows × columns)
        </label>
        <select
          id='board-size'
          value={`${boardSize.rows}x${boardSize.cols}`}
          onChange={(e) => {
            const [rows, cols] = e.target.value.split('x').map(Number)
            setBoardSize({ rows, cols })
          }}
          className='mb-4 w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          {boardSizes.map((size) => (
            <option key={size.label} value={`${size.rows}x${size.cols}`}>
              {size.label}
            </option>
          ))}
        </select>
        <div className='flex justify-between gap-2'>
          <button
            disabled={!name}
            onClick={start}
            className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'>
            Start
          </button>
          <div className='self-center text-sm text-slate-500'>
            Best time: <BestTimeDisplay />
          </div>
        </div>
      </div>
    </div>
  )
}

function BestTimeDisplay() {
  const best = localStorage.getItem('memory_best')
  return <span className='font-medium'>{best ? `${best}s` : '—'}</span>
}
