'use client'

import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, CheckCircle2, Loader, RefreshCcw } from 'lucide-react'

export default function Home () {
  const [text, setText] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(true)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    const initialTheme = storedTheme ?? 'dark'
    setTheme(initialTheme)

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    updateData()
  }, [])

  const updateData = async () => {
    setSaved(false)
    const res = await fetch('/api/content')
    const data = await res.json()
    setText(data.content)
    setIsLoading(false)
    setSaved(true)
  }

  useEffect(() => {
    if (isLoading) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setSaved(false)

    timeoutRef.current = setTimeout(async () => {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      })

      setSaved(true)
    }, 1000)
  }, [text])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  }

  return (
    <main className='relative min-h-screen'>
      {isLoading && (
        <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-50/50 text-amber-400'>
          <Loader size={64} className='animate-spin slow-animation' />
          <span className='font-black text-2xl mt-3'>Loading ...</span>
          <span className='font-black mt-2'>
            Please be patient. It may take a while.
          </span>
        </div>
      )}

      <div
        className={`transition-colors duration-300
        ${
          theme === 'dark'
            ? 'bg-zinc-950 text-zinc-100'
            : 'bg-zinc-100 text-zinc-950'
        }`}
      >
        <header
          className={`flex items-center justify-between px-8 py-5 border-b transition-colors duration-300
          ${
            theme === 'dark'
              ? 'border-zinc-800/60 backdrop-blur-md'
              : 'border-zinc-300/60 backdrop-blur-sm'
          }`}
        >
          <h1 className='text-xl font-semibold tracking-tight'>Quick Share</h1>

          <div className='flex items-center gap-4'>
            <button
              onClick={updateData}
              className={`p-2 rounded-xl transition-colors duration-300 cursor-pointer
              ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'bg-zinc-200 hover:bg-zinc-300'
              }`}
            >
              <RefreshCcw size={16} />
            </button>

            {saved ? (
              <span className='flex items-center gap-1 text-green-500 text-sm'>
                <CheckCircle2 size={16} /> Saved
              </span>
            ) : (
              <span className='text-yellow-500 text-sm animate-pulse'>
                Saving...
              </span>
            )}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors duration-300
              ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'bg-zinc-200 hover:bg-zinc-300'
              }`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className='h-[calc(100vh-5rem)] p-8'>
          <div
            className={`rounded-3xl h-full border p-6 shadow-2xl transition-colors duration-300
            ${
              theme === 'dark'
                ? 'border-zinc-800/70 bg-zinc-900/60 shadow-black/40'
                : 'border-zinc-300/70 bg-white/60 shadow-gray-400'
            }
            backdrop-blur-xl`}
          >
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder='Start typing...'
              className={`w-full h-full resize-none bg-transparent text-base leading-relaxed
              focus:outline-none placeholder:text-zinc-500 transition-colors duration-300
              ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-950'}`}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
