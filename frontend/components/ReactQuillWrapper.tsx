// components/ReactQuillWrapper.tsx
"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ReactQuillNoSSR = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

import "react-quill/dist/quill.snow.css"

export default function ReactQuillWrapper({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return <ReactQuillNoSSR theme="snow" value={value} onChange={onChange} />
}
