import { useEffect, useState } from 'react'
import { cloneDefaultContent } from '../data/defaultContent'
import { isFirebaseConfigured } from '../lib/firebase'
import { subscribePortfolioContent } from '../services/contentService'

export const usePortfolioContent = () => {
  const [content, setContent] = useState(() => cloneDefaultContent())
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(isFirebaseConfigured)

    const unsubscribe = subscribePortfolioContent(
      (nextContent) => {
        setContent(nextContent)
        setIsLoading(false)
      },
      (nextError) => {
        setError(nextError)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return { content, isLoading, error }
}
