import Image from 'next/image'
import Login from '@/components/login'
import Settings from '@/components/settings'
import Logs from '@/components/logs'
export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen">
        <Logs/>
    </main>
  )
}
