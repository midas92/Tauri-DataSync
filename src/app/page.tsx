import Image from 'next/image'
import Login from '@/components/login'
import Settings from '@/components/settings'
export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen">
        <Settings/>
    </main>
  )
}
