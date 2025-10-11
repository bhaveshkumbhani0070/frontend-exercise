type Props = {
  front: string
  back: string
  flipped: boolean
  matched: boolean
  onClick: () => void
}

export default function Tile({ front, back, flipped, matched, onClick }: Props) {
  const isDisabled = flipped || matched
  const handleClick = () => {
    if (!isDisabled) {
      onClick()
    }
  }
  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className='perspective-1000 preserve-3d relative aspect-square w-full transform overflow-hidden rounded-lg border p-1 transition-transform focus:outline-none disabled:opacity-60'
      aria-pressed={isDisabled}>
      <div
        className={`backface-hidden absolute bottom-0 left-0 right-0 top-0 transition-transform duration-300 ${
          flipped || matched ? 'rotate-y-0' : 'rotate-y-180'
        }`}>
        <img src={front} alt='front' className='h-full w-full object-cover' />
      </div>
      <div
        className={`backface-hidden absolute bottom-0 left-0 right-0 top-0 transition-transform duration-300 ${
          flipped || matched ? 'rotate-y-180' : 'rotate-y-0'
        }`}>
        <img src={back} alt='back' className='h-full w-full object-cover' />
      </div>
    </button>
  )
}
