import { BossBattleInterface } from "@/components/boss-battle-interface"

export default function BossBattlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">⚔️ Boss Battle Arena</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Face your failures head-on! When you break a streak, a Failure Boss spawns. Complete penalty tasks to defeat
            them and turn your setbacks into comebacks.
          </p>
        </div>

        <BossBattleInterface />
      </div>
    </div>
  )
}
