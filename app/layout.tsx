import './globals.css'

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-zinc-950 text-zinc-100 transition-colors duration-300'>
        {children}
      </body>
    </html>
  )
}
