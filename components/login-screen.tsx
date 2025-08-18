"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginScreenProps {
  onStartJourney: () => void
}

export function LoginScreen({ onStartJourney }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-secondary/30 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/2 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="font-serif text-3xl text-primary">
            {isLogin ? "Welcome Back!" : "Start Your Journey"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? "Continue your adventure" : "Begin leveling up your real life"}
          </CardDescription>

          {/* Avatar teaser */}
          <div className="flex flex-col items-center space-y-2 py-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                <span className="text-2xl opacity-50">👤</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              🔒 Unlock Customized Core Features of Level Up Life
            </p>
            <p className="text-xs text-muted-foreground/70">(Created by Aiza Fatima)</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLogin ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                onClick={onStartJourney}
              >
                Continue Adventure
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg"
                onClick={onStartJourney}
              >
                Start Your Journey
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 hover:bg-muted/50 bg-transparent"
                onClick={onStartJourney}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login with Google
              </Button>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsLogin(true)}
              >
                Already have an account? Sign in
              </Button>
            </div>
          )}

          {isLogin && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => setIsLogin(false)}
            >
              New here? Start your journey
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
