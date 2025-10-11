import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { shuffle } from '../utils/shuffle'
import Tile from '../components/Tile'
import Timer from '../components/Timer'
import { TileType } from '../types'

const IMAGES = Array.from({ length: 18 }, (_, i) => `/plant${String(i + 1).padStart(2, '0')}.jpg`)

export default function GamePage() {
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') || 'Player'
  const rows = Number(searchParams.get('rows') || '4')
  const cols = Number(searchParams.get('cols') || '4')
  const total = rows * cols
  const pairs = total / 2

  const back = '/growy_logo.svg'
  const [tiles, setTiles] = useState<TileType[]>([])
  const [firstInd, setFirstInd] = useState<number | null>(null)
  const [secondInd, setSecondInd] = useState<number | null>(null)
  const [matchedCount, setMatchedCount] = useState(0)
  const [running, setRunning] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [moves, setMoves] = useState(0)

  const navigate = useNavigate()
  // Shuffle tiles
  useEffect(() => {
    const chosenImg = IMAGES.slice(0, pairs)
    const doubled = chosenImg.flatMap((img) => [img, img])
    const shuffled = shuffle(doubled).map((img, i) => ({ id: `${i}-${img}`, image: img, matched: false }))
    setTiles(shuffled)
  }, [pairs])
  // Handle tile matching logic when two tiles are flipped
  useEffect(() => {
    if (firstInd !== null && secondInd !== null) {
      setMoves((m) => m + 1)
      const a = tiles[firstInd]
      const b = tiles[secondInd]
      if (a.image === b.image) {
        setTimeout(() => {
          setTiles((prev) => prev.map((t, idx) => (idx === firstInd || idx === secondInd ? { ...t, matched: true } : t)))
          setMatchedCount((c) => c + 2)
          setFirstInd(null)
          setSecondInd(null)
        }, 500)
      } else {
        setTimeout(() => {
          setFirstInd(null)
          setSecondInd(null)
        }, 700)
      }
    }
  }, [firstInd, secondInd, tiles])
  // check for game end and navigate to end page
  useEffect(() => {
    if (matchedCount === total && total > 0) {
      setRunning(false)
      const prevBest = Number(localStorage.getItem('memory_best') || '0')
      if (!prevBest || seconds < prevBest) localStorage.setItem('memory_best', String(seconds))
      const q = new URLSearchParams({ name, seconds: String(seconds), moves: String(moves) })
      setTimeout(() => navigate(`/end?${q.toString()}`), 900)
    }
  }, [matchedCount, total, seconds, name, moves, navigate])

  const onTick = useCallback((s: number) => setSeconds(s), [])

  const flip = (index: number) => {
    if (firstInd === index || secondInd === index) return
    if (firstInd === null) setFirstInd(index)
    else if (secondInd === null) setSecondInd(index)
  }

  return (
    <div className='min-h-screen bg-slate-100 p-4'>
      <div className='mx-auto max-w-2xl'>
        <header className='mb-4 flex items-center justify-between'>
          <div>
            <div className='text-sm text-slate-600'>Player</div>
            <div className='text-lg font-semibold'>{name}</div>
          </div>
          <div className='text-right'>
            <div className='text-sm text-slate-600'>Time</div>
            <div className='text-lg font-semibold'>{seconds}s</div>
            <div className='text-sm text-slate-500'>Moves: {moves}</div>
          </div>
        </header>
        <Timer running={running} onTick={onTick} />
        <div className='grid justify-items-center gap-3' style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} data-testid='game-board'>
          {tiles.map((t, idx) => {
            const flipped = idx === firstInd || idx === secondInd || t.matched
            return (
              <div key={t.id} className='aspect-square w-full'>
                <Tile front={t.image} back={back} flipped={flipped} matched={t.matched} onClick={() => flip(idx)} />
              </div>
            )
          })}
        </div>
        <div className='mt-4 flex gap-2'>
          <button onClick={() => navigate('/')} className='rounded border px-3 py-2'>
            Quit
          </button>
          <button onClick={() => window.location.reload()} className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            Restart
          </button>
        </div>
      </div>
    </div>
  )
}
