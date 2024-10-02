import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onUpload: (url: string) => void
  initialImage?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, initialImage }) => {
  const [image, setImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage)
    }
  }, [initialImage])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        if (data.success && data.filePath) {
          setImage(data.filePath)
          onUpload(data.filePath)
        } else {
          throw new Error('Upload failed')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {image && (
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt="Uploaded image"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : image ? 'Change Image' : 'Upload Image'}
        </Button>
      </label>
    </div>
  )
}
