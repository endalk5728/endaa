'use client'

import { FieldError } from "react-hook-form";
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/hooks/use-toast"

// Form validation schemas
const passwordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

const usernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
})

const emailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
})

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be 160 characters or less"),
})

const aboutUsSchema = z.object({
  aboutUsContent: z.string().min(10, "About Us content must be at least 10 characters"),
})

const socialMediaSchema = z.object({
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal('')),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal('')),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal('')),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  telegram: z.string().url("Invalid telegram URL").optional().or(z.literal('')),
})

const allRightsReservedSchema = z.object({
  copyrightText: z.string().min(5, "Copyright text must be at least 5 characters"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
})

type FormData = z.infer<typeof passwordSchema> | 
                z.infer<typeof usernameSchema> | 
                z.infer<typeof emailSchema> | 
                z.infer<typeof profileSchema> | 
                z.infer<typeof aboutUsSchema> | 
                z.infer<typeof socialMediaSchema> | 
                z.infer<typeof allRightsReservedSchema>;

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const usernameForm = useForm({
    resolver: zodResolver(usernameSchema),
  })

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
  })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
  })

  const aboutUsForm = useForm({
    resolver: zodResolver(aboutUsSchema),
  })

  const socialMediaForm = useForm({
    resolver: zodResolver(socialMediaSchema),
  })

  const allRightsReservedForm = useForm({
    resolver: zodResolver(allRightsReservedSchema),
  })

  const handleSubmit = async (data: FormData, endpoint: string) => {
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      let apiEndpoint = '';
      switch (endpoint) {
        case 'change-password':
          apiEndpoint = '/api/user/change-password';
          break;
        case 'change-username':
          apiEndpoint = '/api/user/change-username';
          break;
        case 'change-email':
          apiEndpoint = '/api/user/change-email';
          break;
        case 'update-profile':
          apiEndpoint = '/api/user/update-profile';
          break;
        case 'update-about-us':
          apiEndpoint = '/api/pages/aboutus';
          break;
        case 'update-social-media':
          apiEndpoint = '/api/pages/socialmedia';
          break;
        case 'update-copyright':
          apiEndpoint = '/api/pages/copyright';
          break;
        default:
          throw new Error('Invalid endpoint');
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: session?.user?.id }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage(result.message);
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        throw new Error(result.error || `Failed to update ${endpoint.replace('-', ' ')}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4 max-w-2xl">
    <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
    
    {successMessage && (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline"> {successMessage}</span>
      </div>
    )}

    <div className="space-y-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {activeForm ? activeForm.charAt(0).toUpperCase() + activeForm.slice(1) : "Select an option"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>User Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setActiveForm('password')}>Change Password</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setActiveForm('username')}>Change Username</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setActiveForm('email')}>Change Email</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Profile Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setActiveForm('profile')}>Edit Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Admin Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setActiveForm('aboutUs')}>About Us</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setActiveForm('socialMedia')}>Social Media</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setActiveForm('allRightsReserved')}>All Rights Reserved</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

        {activeForm === 'password' && (
          <form onSubmit={passwordForm.handleSubmit((data) => handleSubmit(data, 'change-password'))} className="space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <Input
              type="password"
              placeholder="New Password"
              {...passwordForm.register("newPassword")}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-red-500">
                {(passwordForm.formState.errors.newPassword as FieldError)?.message || "Invalid password"}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Change Password
            </Button>
          </form>
        )}

        {activeForm === 'username' && (
          <form onSubmit={usernameForm.handleSubmit((data) => handleSubmit(data, 'change-username'))} className="space-y-4">
            <h2 className="text-xl font-semibold">Change Username</h2>
            <Input
              type="text"
              placeholder="New Username"
              {...usernameForm.register("newUsername")}
            />
            {usernameForm.formState.errors.newUsername && (
              <p className="text-red-500">
                {(usernameForm.formState.errors.newUsername as FieldError)?.message || "Invalid username"}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Change Username
            </Button>
          </form>
        )}

        {activeForm === 'email' && (
          <form onSubmit={emailForm.handleSubmit((data) => handleSubmit(data, 'change-email'))} className="space-y-4">
            <h2 className="text-xl font-semibold">Change Email</h2>
            <Input
              type="email"
              placeholder="New Email"
              {...emailForm.register("newEmail")}
            />
            {emailForm.formState.errors.newEmail && (
              <p className="text-red-500">
                {(emailForm.formState.errors.newEmail as FieldError)?.message || "Invalid email"}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Change Email
            </Button>
          </form>
        )}

        {activeForm === 'profile' && (
          <form onSubmit={profileForm.handleSubmit((data) => handleSubmit(data, 'update-profile'))} className="space-y-4">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <Input
              type="text"
              placeholder="Full Name"
              {...profileForm.register("fullName")}
            />
            {profileForm.formState.errors.fullName && (
              <p className="text-red-500">
                {(profileForm.formState.errors.fullName as FieldError)?.message || "Invalid full name"}
              </p>
            )}
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Bio (160 characters max)"
              {...profileForm.register("bio")}
            />
            {profileForm.formState.errors.bio && (
              <p className="text-red-500">
                {(profileForm.formState.errors.bio as FieldError)?.message || "Invalid bio"}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Profile
            </Button>
          </form>
        )}


{activeForm === 'aboutUs' && (
          <form onSubmit={aboutUsForm.handleSubmit((data) => handleSubmit(data, 'update-about-us'))} className="space-y-4">
            <h2 className="text-xl font-semibold">About Us</h2>
            <Textarea
              placeholder="About Us Content"
              {...aboutUsForm.register("aboutUsContent")}
            />
            {aboutUsForm.formState.errors.aboutUsContent && (
              <p className="text-red-500">
                {(aboutUsForm.formState.errors.aboutUsContent as FieldError)?.message || "Invalid content"}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update About Us
            </Button>
          </form>
        )}

        {activeForm === 'socialMedia' && (
          <form onSubmit={socialMediaForm.handleSubmit((data) => handleSubmit(data, 'update-social-media'))} className="space-y-4">
            <h2 className="text-xl font-semibold">Social Media Links</h2>
            <Input
              type="url"
              placeholder="Facebook URL"
              {...socialMediaForm.register("facebook")}
            />
            {socialMediaForm.formState.errors.facebook && (
              <p className="text-red-500">
                {(socialMediaForm.formState.errors.facebook as FieldError)?.message || "Invalid Facebook URL"}
              </p>
            )}
            <Input
              type="url"
              placeholder="Twitter URL"
              {...socialMediaForm.register("twitter")}
            />
            {socialMediaForm.formState.errors.twitter && (
              <p className="text-red-500">
                {(socialMediaForm.formState.errors.twitter as FieldError)?.message || "Invalid Twitter URL"}
              </p>
            )}
            <Input
              type="url"
              placeholder="Instagram URL"
              {...socialMediaForm.register("instagram")}
            />
            {socialMediaForm.formState.errors.instagram && (
              <p className="text-red-500">
                {(socialMediaForm.formState.errors.instagram as FieldError)?.message || "Invalid Instagram URL"}
              </p>
            )}
            <Input
              type="url"
              placeholder="LinkedIn URL"
              {...socialMediaForm.register("linkedin")}
            />

{socialMediaForm.formState.errors.linkedin && (
              <p className="text-red-500">
                {(socialMediaForm.formState.errors.linkedin as FieldError)?.message || "Invalid LinkedIn URL"}
              </p>
            )}
            <Input
              type="url"
              placeholder="telegram URL"
              {...socialMediaForm.register("telegram")}
            />
             {socialMediaForm.formState.errors.telegram && (
              <p className="text-red-500">
                {(socialMediaForm.formState.errors.telegram as FieldError)?.message || "Invalid telegram URL"}
              </p>
            )} 
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Social Media Links
            </Button>
          </form>
        )}

        {activeForm === 'allRightsReserved' && (
          <form onSubmit={allRightsReservedForm.handleSubmit((data) => handleSubmit(data, 'update-copyright'))} className="space-y-4">
            <h2 className="text-xl font-semibold">All Rights Reserved</h2>
            <Input
              type="text"
              placeholder="Copyright Text"
              {...allRightsReservedForm.register("copyrightText")}
            />
            {allRightsReservedForm.formState.errors.copyrightText && (
              <p className="text-red-500">
                {(allRightsReservedForm.formState.errors.copyrightText as FieldError)?.message || "Invalid copyright text"}
              </p>
            )}
            <Input
              type="text"
              placeholder="Year"
              {...allRightsReservedForm.register("year")}
            />
            {allRightsReservedForm.formState.errors.year && (
              <p className="text-red-500">
                {(allRightsReservedForm.formState.errors.year as FieldError)?.message || "Invalid year"}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Copyright Information
            </Button>
          </form>
        )}





      </div>
    </div>
  )
}
