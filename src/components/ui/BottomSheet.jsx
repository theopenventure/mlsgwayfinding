import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

// Snap points are expressed as fractions of the parent's height that the sheet
// occupies (visible height): peek = 0.32 (~one card visible), expanded = 0.88.
const PEEK_FRACTION = 0.32
const EXPANDED_FRACTION = 0.88

export default function BottomSheet({ children, expanded, onExpandedChange, className }) {
  const [containerHeight, setContainerHeight] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef(null)
  const dragStartY = useRef(0)
  const didDragRef = useRef(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    function update() {
      if (sheetRef.current?.parentElement) {
        setContainerHeight(sheetRef.current.parentElement.clientHeight)
      }
    }
    update()
    const observer = new ResizeObserver(update)
    if (sheetRef.current?.parentElement) observer.observe(sheetRef.current.parentElement)
    return () => observer.disconnect()
  }, [])

  const peekHeight = Math.round(containerHeight * PEEK_FRACTION)
  const expandedHeight = Math.round(containerHeight * EXPANDED_FRACTION)
  const targetHeight = expanded ? expandedHeight : peekHeight
  const visibleHeight = Math.max(0, Math.min(expandedHeight, targetHeight + dragOffset))

  const handleStart = useCallback((clientY) => {
    if (expanded && scrollRef.current && scrollRef.current.scrollTop > 0) return false
    setIsDragging(true)
    didDragRef.current = false
    dragStartY.current = clientY
    return true
  }, [expanded])

  const handleMove = useCallback((clientY) => {
    if (!isDragging) return
    const delta = dragStartY.current - clientY
    if (Math.abs(delta) > 4) didDragRef.current = true
    setDragOffset(delta)
  }, [isDragging])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    if (didDragRef.current) {
      const finalHeight = targetHeight + dragOffset
      const midpoint = (peekHeight + expandedHeight) / 2
      const shouldExpand = finalHeight > midpoint
      if (shouldExpand !== expanded) onExpandedChange(shouldExpand)
    }
    setDragOffset(0)
  }, [isDragging, targetHeight, dragOffset, peekHeight, expandedHeight, expanded, onExpandedChange])

  function onTouchStart(e) {
    handleStart(e.touches[0].clientY)
  }
  function onTouchMove(e) {
    handleMove(e.touches[0].clientY)
  }
  function onTouchEnd() {
    handleEnd()
  }

  // Mouse drag for desktop dev-testing
  useEffect(() => {
    if (!isDragging) return
    function onMouseMove(e) { handleMove(e.clientY) }
    function onMouseUp() { handleEnd() }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, handleMove, handleEnd])

  function onHandleMouseDown(e) {
    e.preventDefault()
    handleStart(e.clientY)
  }

  function toggle() {
    if (didDragRef.current) return
    onExpandedChange(!expanded)
  }

  return (
    <div
      ref={sheetRef}
      data-motion-transform
      style={{
        height: `${visibleHeight}px`,
        transition: isDragging ? 'none' : 'height var(--motion-medium) var(--ease-out-soft)',
      }}
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-float flex flex-col touch-pan-y',
        className,
      )}
    >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onHandleMouseDown}
        onClick={toggle}
        className="flex-shrink-0 pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing"
      >
        <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto" />
      </div>
      <div
        ref={scrollRef}
        className={cn('flex-1 min-h-0', expanded ? 'overflow-y-auto' : 'overflow-hidden')}
      >
        {children}
      </div>
    </div>
  )
}
