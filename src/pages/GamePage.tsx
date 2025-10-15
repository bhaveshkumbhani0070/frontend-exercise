import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { shuffle } from '../utils/shuffle'
import Tile from '../components/Tile'
import { TileType } from '../types'
import { useTimer } from '../utils/useTimer'

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
  const [matchedCount, setMatchedCount] = useState(0)
  const [running, setRunning] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [moves, setMoves] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const chosenImg = IMAGES.slice(0, pairs)
    const doubled = [...chosenImg, ...chosenImg]
    const shuffled: TileType[] = shuffle(doubled).map((img, i) => ({
      id: `${i}-${img}`,
      image: img,
      matched: false,
      flipped: false
    }))
    setTiles(shuffled)
  }, [pairs])

  useEffect(() => {
    if (matchedCount === pairs) {
      setRunning(false)
      const best = localStorage.getItem('memory_best')
      if (!best || seconds < Number(best)) {
        localStorage.setItem('memory_best', String(seconds))
      }
      const params = new URLSearchParams({ name, seconds: String(seconds), moves: String(moves) })
      navigate(`/end?${params.toString()}`)
    }
  }, [matchedCount, pairs, name, seconds, moves, navigate])

  const flip = useCallback(
    (index: number) => {
      const flippedTiles = tiles.map((t, idx) => ({ ...t, idx })).filter((t) => t.flipped && !t.matched)

      if (flippedTiles.length >= 2 || tiles[index].matched || tiles[index].flipped) return

      setTiles((prev) => prev.map((t, idx) => (idx === index ? { ...t, flipped: true } : t)))

      if (flippedTiles.length === 1) {
        setMoves((m) => m + 1) // Increment moves when second tile is flipped
        const first = flippedTiles[0]
        const second = { ...tiles[index], idx: index }
        if (first.image === second.image) {
          setTiles((prev) => prev.map((t, idx) => (idx === first.idx || idx === second.idx ? { ...t, matched: true, flipped: true } : t)))
          setMatchedCount((c) => c + 1)
        } else {
          setTimeout(() => {
            setTiles((prev) => prev.map((t, idx) => (idx === first.idx || idx === second.idx ? { ...t, flipped: false } : t)))
          }, 1000)
        }
      }
    },
    [tiles]
  )

  useTimer(running, setSeconds)

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
        <div className='grid justify-items-center gap-3' style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} data-testid='game-board'>
          {tiles.map((tile, idx) => (
            <div key={tile.id} className='aspect-square w-full'>
              <Tile tile={tile} back={back} onClick={() => flip(idx)} />
            </div>
          ))}
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
