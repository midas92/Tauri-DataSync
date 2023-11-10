import Image from 'next/image'
import Login from '@/components/login'
export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen">
        <Login/>
    </main>
  )
}
