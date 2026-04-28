import { useEffect, useState } from 'react'

/**
 * Keeps a component mounted for `exitMs` after `open` becomes false so an
 * exit animation can play. Returns:
 *   - shouldRender: whether to render at all
 *   - isExiting: true during the exit window (apply the exit class while this is true)
 */
export function useDelayedUnmount(open, exitMs = 200) {
  const [shouldRender, setShouldRender] = useState(open)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsExiting(false)
      return
    }
    if (!shouldRender) return
    setIsExiting(true)
    const t = setTimeout(() => {
      setShouldRender(false)
      setIsExiting(false)
    }, exitMs)
    return () => clearTimeout(t)
  }, [open, exitMs, shouldRender])

  return { shouldRender, isExiting }
}
