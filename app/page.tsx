import { Suspense } from 'react'
import HomeContent from '@/components/home-content'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
