import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StartPage() {
  const [name, setName] = useState('')
  const [boardSize, setBoardSize] = useState('4x4')
  const [rows, cols] = boardSize.split('x').map(Number)
  const navigate = useNavigate()

  function start() {
    const params = new URLSearchParams({ name, rows: String(rows), cols: String(cols) })
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='mb-4 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Your name'
        />
        <label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='board-size'>
          Select Board Size (rows × columns)
        </label>
        <select
          id='board-size'
          value={boardSize}
          onChange={(e) => setBoardSize(e.target.value)}
          className='mb-4 w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <option value='2x2'>2x2</option>
          <option value='4x4'>4x4</option>
          <option value='4x5'>4x5</option>
          <option value='6x6'>6x6</option>
        </select>
        <div className='flex justify-between gap-2'>
          <button
            disabled={!name.trim()}
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
