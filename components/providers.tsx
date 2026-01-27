'use client'

import React from 'react'
import { GuestProvider } from '@/lib/guest-context'
import { LifeCoinsProvider } from '@/lib/lifecoins-context'
import { TasksProvider } from '@/lib/tasks-context'
import { ReflectionProvider } from '@/lib/reflection-context'
import { BossBattleProvider } from '@/lib/boss-battle-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GuestProvider>
      <LifeCoinsProvider>
        <TasksProvider>
          <ReflectionProvider>
            <BossBattleProvider>{children}</BossBattleProvider>
          </ReflectionProvider>
        </TasksProvider>
      </LifeCoinsProvider>
    </GuestProvider>
  )
}
