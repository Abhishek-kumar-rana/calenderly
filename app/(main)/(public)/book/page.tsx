'use client'

import Loading from "@/components/Loading"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function PublicPage() {
  const { user, isLoaded } = useUser()  // Using `isLoaded` to check if user data is available

  if (!isLoaded) {
    // Display loading until user data is loaded
    return <Loading />
  }

  if (!user) {
    // Redirect to login if no user is found
    return redirect('/login')
  }
  

  // Once user is available, redirect to the booking page [Public Profile Page]
  return redirect(`/book/${user.id}`)
  return (
    <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
      <h1 className="text-2xl font-bold">Welcome to the Public Page</h1>
      <p>This is a public page accessible without authentication.</p>
    </main>
  )
}
