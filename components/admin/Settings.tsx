import { useState } from 'react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [message, setMessage] = useState<string | null>(null)

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newPassword = (e.target as HTMLFormElement).newPassword.value
    const response = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    })
    if (response.ok) {
      setMessage('Password changed successfully')
    } else {
      setMessage('Failed to change password')
    }
  }

  const handleUsernameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newUsername = (e.target as HTMLFormElement).newUsername.value
    const response = await fetch('/api/user/change-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newUsername }),
    })
    if (response.ok) {
      setMessage('Username changed successfully')
    } else {
      setMessage('Failed to change username')
    }
  }

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newEmail = (e.target as HTMLFormElement).newEmail.value
    const response = await fetch('/api/user/change-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newEmail }),
    })
    if (response.ok) {
      setMessage('Email changed successfully')
    } else {
      setMessage('Failed to change email')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      
      <div className="space-y-8">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <Input type="password" name="newPassword" placeholder="New Password" required />
          <Button type="submit">Change Password</Button>
        </form>

        <form onSubmit={handleUsernameChange} className="space-y-4">
          <h2 className="text-xl font-semibold">Change Username</h2>
          <Input type="text" name="newUsername" placeholder="New Username" required />
          <Button type="submit">Change Username</Button>
        </form>

        <form onSubmit={handleEmailChange} className="space-y-4">
          <h2 className="text-xl font-semibold">Change Email</h2>
          <Input type="email" name="newEmail" placeholder="New Email" required />
          <Button type="submit">Change Email</Button>
        </form>
      </div>
    </div>
  )
}
