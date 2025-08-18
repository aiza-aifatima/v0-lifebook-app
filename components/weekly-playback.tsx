"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useReflection } from "@/lib/reflection-context"
import type { AvatarMood } from "@/components/avatar-companion"

const moodEmojis: Record<AvatarMood, string> = {
  happy: "😊",
  sad: "😔",
  lazy: "😴",
  powerful: "💪",
  excited: "🎉",
  focused: "🎯",
}

export function WeeklyPlayback() {
  const { getWeeklyReflection, getMoodTrends, state } = useReflection()
  const [currentSlide, setCurrentSlide] = useState(0)

  const weeklyData = getWeeklyReflection()
  const moodTrends = getMoodTrends()

  const slides = [
    {
      title: "Your Week in Review",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">📊</div>
          <h3 className="text-xl font-semibold">Weekly Reflection Playback</h3>
          <p className="text-muted-foreground">Let's look back at your journey this week and see how you've grown</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weeklyData.wins.length}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{weeklyData.losses.length}</div>
              <div className="text-sm text-muted-foreground">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weeklyData.insights.length}</div>
              <div className="text-sm text-muted-foreground">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{state.entries.length}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your Wins This Week",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-semibold">Celebrating Your Victories</h3>
          </div>
          {weeklyData.wins.length > 0 ? (
            <div className="space-y-3">
              {weeklyData.wins.slice(0, 3).map((win) => (
                <Card key={win.id} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{win.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{win.content.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">
                        {moodEmojis[win.mood]} {win.mood}
                      </Badge>
                      <Badge variant="outline">⚡ {win.energy}/10</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No wins recorded this week.</p>
              <p className="text-sm text-muted-foreground">Remember to celebrate your achievements!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Learning from Challenges",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">💪</div>
            <h3 className="text-xl font-semibold">Growth Through Challenges</h3>
          </div>
          {weeklyData.losses.length > 0 ? (
            <div className="space-y-3">
              {weeklyData.losses.slice(0, 3).map((loss) => (
                <Card key={loss.id} className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{loss.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{loss.content.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">
                        {moodEmojis[loss.mood]} {loss.mood}
                      </Badge>
                      <Badge variant="outline">⚡ {loss.energy}/10</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No challenges recorded this week.</p>
              <p className="text-sm text-muted-foreground">Every setback is a setup for a comeback!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Your Mood Journey",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <h3 className="text-xl font-semibold">Mood Trends</h3>
          </div>
          <div className="space-y-3">
            {moodTrends.slice(0, 4).map((trend) => (
              <div key={trend.mood} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{moodEmojis[trend.mood]}</span>
                  <span className="font-medium capitalize">{trend.mood}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress
                    value={(trend.count / Math.max(...moodTrends.map((t) => t.count))) * 100}
                    className="w-24 h-2"
                  />
                  <span className="text-sm text-muted-foreground">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Your most common mood this week: {moodEmojis[moodTrends[0]?.mood]} {moodTrends[0]?.mood}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Key Insights",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">💡</div>
            <h3 className="text-xl font-semibold">Your Wisdom This Week</h3>
          </div>
          {weeklyData.insights.length > 0 ? (
            <div className="space-y-3">
              {weeklyData.insights.slice(0, 2).map((insight) => (
                <Card key={insight.id} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-foreground mt-1 italic">"{insight.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No insights recorded this week.</p>
              <p className="text-sm text-muted-foreground">Take time to reflect on what you've learned!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Looking Forward",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🚀</div>
          <h3 className="text-xl font-semibold">Ready for Next Week?</h3>
          <p className="text-muted-foreground">
            You've made progress this week. Keep reflecting, keep growing, and remember - every entry in your vault is a
            step forward in your journey.
          </p>
          <div className="bg-primary/10 rounded-lg p-4 mt-6">
            <p className="text-sm font-medium">💡 Reflection Tip</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try to write at least one reflection entry each day. It helps build self-awareness and tracks your
              personal growth over time.
            </p>
          </div>
        </div>
      ),
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-serif text-xl flex items-center justify-between">
          <span>{slides[currentSlide].title}</span>
          <Badge variant="outline">
            {currentSlide + 1} / {slides.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="min-h-[300px]">{slides[currentSlide].content}</div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
            ← Previous
          </Button>

          <div className="flex space-x-1">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          <Button variant="outline" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
            Next →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
