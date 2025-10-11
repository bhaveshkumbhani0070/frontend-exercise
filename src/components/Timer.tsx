import { useEffect } from 'react'

type Props = {
  running: boolean
  onTick: (seconds: number) => void
}
// Timer is a triggers onTick every second when running is true
export default function Timer({ running, onTick }: Props) {
  useEffect(() => {
    let seconds = 0
    if (!running) return
    const id = setInterval(() => {
      seconds += 1
      onTick(seconds)
    }, 1000)
    return () => clearInterval(id)
  }, [running, onTick])
  return null
}
