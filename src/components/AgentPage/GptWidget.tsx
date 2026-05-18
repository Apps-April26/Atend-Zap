'use client'

import { useEffect } from 'react'

interface Props {
  widgetUrl: string
  niche: string
}

export default function GptWidget({ widgetUrl, niche }: Props) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = widgetUrl
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [widgetUrl, niche])

  return null
}