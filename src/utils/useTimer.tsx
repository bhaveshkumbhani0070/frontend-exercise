import { useEffect } from 'react'

export function useTimer(running: boolean, onTick: (seconds: number) => void) {
  useEffect(() => {
    let seconds = 0
    if (!running) return
    const id = setInterval(() => {
      seconds += 1
      onTick(seconds)
    }, 1000)
    return () => clearInterval(id)
  }, [running, onTick])
}
