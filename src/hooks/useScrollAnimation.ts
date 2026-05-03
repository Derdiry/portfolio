import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

export function useTypingAnimation(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setDisplayed(current.slice(0, charIndex + 1))
          setCharIndex((c) => c + 1)
        } else {
          setTimeout(() => setDeleting(true), pause)
        }
      } else {
        if (charIndex > 0) {
          setDisplayed(current.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setDeleting(false)
          setWordIndex((w) => (w + 1) % words.length)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex, words, speed, pause])

  return displayed
}
