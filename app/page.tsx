"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Sparkles, Users, Trophy } from "lucide-react"

interface StoryChoice {
  id: string
  text: string
  consequence: string
  nextScene: string
}

interface StoryScene {
  id: string
  title: string
  content: string
  choices: StoryChoice[]
  atmosphere: "mysterious" | "adventurous" | "peaceful" | "dramatic"
}

const storyScenes: StoryScene[] = [
  {
    id: "start",
    title: "The Enchanted Library",
    content:
      "You find yourself standing before an ancient library that shouldn't exist. The building materializes from morning mist, its Gothic spires reaching toward storm clouds. Golden light spills from tall windows, and you hear the faint sound of pages turning in the wind. A brass nameplate reads: 'The Repository of Untold Stories.'",
    atmosphere: "mysterious",
    choices: [
      {
        id: "enter",
        text: "Push open the heavy oak doors",
        consequence: "Your curiosity leads you into the unknown",
        nextScene: "library-interior",
      },
      {
        id: "investigate",
        text: "Circle the building to investigate",
        consequence: "Caution reveals hidden secrets",
        nextScene: "hidden-entrance",
      },
      {
        id: "wait",
        text: "Wait and observe from a distance",
        consequence: "Patience unveils the library's true nature",
        nextScene: "revelation",
      },
    ],
  },
  {
    id: "library-interior",
    title: "The Living Books",
    content:
      "Inside, books float gently through the air like luminous butterflies. Shelves stretch impossibly high, defying architectural logic. A figure in flowing robes approaches—the Keeper of Stories. 'Welcome, Story Seeker,' they whisper. 'Every book here contains a life unlived, a path not taken. Choose wisely, for once you enter a story, it becomes part of you forever.'",
    atmosphere: "adventurous",
    choices: [
      {
        id: "adventure-book",
        text: "Reach for a glowing adventure tome",
        consequence: "Embrace the call of adventure",
        nextScene: "dragon-quest",
      },
      {
        id: "mystery-book",
        text: "Select a shadowy mystery novel",
        consequence: "Dive into intrigue and secrets",
        nextScene: "detective-story",
      },
      {
        id: "ask-keeper",
        text: "Ask the Keeper for guidance",
        consequence: "Seek wisdom before choosing",
        nextScene: "keeper-wisdom",
      },
    ],
  },
  {
    id: "hidden-entrance",
    title: "The Secret Garden",
    content:
      "Behind the library, you discover a hidden garden where story fragments grow like flowers. Each bloom whispers a different tale—love stories in roses, adventures in sunflowers, mysteries in midnight jasmine. At the garden's heart stands a fountain where liquid starlight flows, and floating above it, an open book writes itself with invisible hands.",
    atmosphere: "peaceful",
    choices: [
      {
        id: "touch-fountain",
        text: "Touch the starlight fountain",
        consequence: "Connect with the source of all stories",
        nextScene: "story-source",
      },
      {
        id: "pick-flower",
        text: "Pick a story flower",
        consequence: "Claim a fragment of narrative power",
        nextScene: "flower-magic",
      },
      {
        id: "read-floating-book",
        text: "Try to read the floating book",
        consequence: "Attempt to understand the meta-narrative",
        nextScene: "meta-story",
      },
    ],
  },
]

export default function InteractiveStorytellingApp() {
  const [currentScene, setCurrentScene] = useState<StoryScene>(storyScenes[0])
  const [storyPath, setStoryPath] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(true)
  const [showChoices, setShowChoices] = useState(false)

  useEffect(() => {
    setIsTyping(true)
    setShowChoices(false)

    const typingTimer = setTimeout(() => {
      setIsTyping(false)
      setShowChoices(true)
    }, 2000)

    return () => clearTimeout(typingTimer)
  }, [currentScene])

  const handleChoice = (choice: StoryChoice) => {
    setStoryPath((prev) => [...prev, choice.text])
    const nextScene = storyScenes.find((scene) => scene.id === choice.nextScene)
    if (nextScene) {
      setCurrentScene(nextScene)
    }
  }

  const resetStory = () => {
    setCurrentScene(storyScenes[0])
    setStoryPath([])
  }

  const getAtmosphereStyles = (atmosphere: string) => {
    switch (atmosphere) {
      case "mysterious":
        return "bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black/20"
      case "adventurous":
        return "bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20"
      case "peaceful":
        return "bg-gradient-to-br from-green-400/20 via-blue-400/20 to-teal-400/20"
      case "dramatic":
        return "bg-gradient-to-br from-red-600/20 via-purple-600/20 to-black/20"
      default:
        return "bg-gradient-to-br from-primary/10 to-secondary/10"
    }
  }

  if (storyPath.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-6xl font-serif font-black text-primary mb-4">StoryWeave</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in interactive narratives where every choice shapes your destiny. Experience stories that
              adapt, evolve, and respond to your decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif font-bold text-lg mb-2">Choice-Driven</h3>
              <p className="text-sm text-muted-foreground">Every decision creates a unique narrative path</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Sparkles className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-serif font-bold text-lg mb-2">Immersive</h3>
              <p className="text-sm text-muted-foreground">Rich atmospheres that respond to your choices</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-serif font-bold text-lg mb-2">Personal</h3>
              <p className="text-sm text-muted-foreground">Stories that adapt to your preferences</p>
            </Card>
          </div>

          <Button
            onClick={() => setStoryPath(["begin"])}
            size="lg"
            className="text-lg px-8 py-6 animate-glow font-serif font-bold"
          >
            Begin Your Story
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getAtmosphereStyles(currentScene.atmosphere)} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Story Progress */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Chapter {storyPath.length}</span>
          </div>
          <Button variant="outline" size="sm" onClick={resetStory}>
            Start Over
          </Button>
        </div>

        {/* Story Path */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {storyPath.slice(-3).map((choice, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {choice}
              </Badge>
            ))}
          </div>
        </div>

        {/* Main Story Content */}
        <Card className="p-8 mb-8 backdrop-blur-sm bg-card/80 border-primary/20">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6 animate-fade-in-up">{currentScene.title}</h2>

          <div
            className={`text-lg leading-relaxed mb-8 ${isTyping ? "animate-typewriter overflow-hidden whitespace-nowrap" : "animate-fade-in-up"}`}
          >
            {currentScene.content}
          </div>

          {/* Choices */}
          {showChoices && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-4">What do you choose?</h3>
              <div className="grid gap-4">
                {currentScene.choices.map((choice, index) => (
                  <Button
                    key={choice.id}
                    variant="outline"
                    className="p-6 h-auto text-left justify-start hover:bg-primary/10 hover:border-primary transition-all duration-300 group bg-transparent"
                    onClick={() => handleChoice(choice)}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="space-y-2">
                      <div className="font-medium group-hover:text-primary transition-colors">{choice.text}</div>
                      <div className="text-sm text-muted-foreground italic">{choice.consequence}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
