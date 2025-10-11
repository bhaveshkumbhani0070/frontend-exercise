import { useNavigate, useSearchParams } from 'react-router-dom'

export default function EndPage() {
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') || 'Player'
  const seconds = searchParams.get('seconds') || '0'
  const moves = searchParams.get('moves') || '0'
  const navigate = useNavigate()

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50'>
      <div className='w-full max-w-md rounded bg-white p-6 text-center shadow-md'>
        <h2 className='mb-2 text-2xl font-semibold'>Well done, {name}!</h2>
        <p className='mb-4 text-slate-700'>
          You finished in <strong>{seconds}s</strong> with <strong>{moves}</strong> moves.
        </p>
        <div className='flex justify-center gap-2'>
          <button onClick={() => navigate(-1)} className='rounded border px-4 py-2'>
            Play again
          </button>
          <button onClick={() => navigate('/')} className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            Back to start
          </button>
        </div>
      </div>
    </div>
  )
}
