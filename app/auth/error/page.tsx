"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-sky-100 via-lavender-50 to-purple-100">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-destructive/20">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-destructive/80 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-serif text-destructive">Oops! Something Went Wrong</CardTitle>
            <CardDescription className="text-base mt-2">The magic spell didn&apos;t work this time</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>There was an error during authentication. This could be because:</p>
              <ul className="mt-2 text-left list-disc list-inside space-y-1">
                <li>The confirmation link has expired</li>
                <li>The link was already used</li>
                <li>There was a network issue</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Try Signing Up Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">Created by Aiza Fatima (Azauresthic)</p>
      </div>
    </div>
  )
}
