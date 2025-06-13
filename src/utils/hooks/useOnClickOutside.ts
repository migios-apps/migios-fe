import { useEffect } from 'react'

type EventType = MouseEvent | TouchEvent

/**
 * Hook untuk menangani klik di luar elemen yang diberikan.
 * @param ref - React ref yang menunjuk ke elemen yang ingin dipantau.
 * @param handler - Callback function yang akan dipanggil ketika terjadi klik di luar elemen.
 * @example
 * ```tsx
 * const containerRef = useRef(null);
 * useOnClickOutside([containerRef], () => {
 *   // Handle clicks outside the container.
 * });
 * ```
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>, // ✅ Memastikan ref bisa null
  handler: (event: EventType) => void
) {
  useEffect(() => {
    function listener(event: EventType) {
      // Jika ref null atau klik terjadi di dalam elemen, keluar
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
