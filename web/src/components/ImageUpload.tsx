'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ value, onChange, maxImages = 4 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.')
      return null
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return null
    }

    // Get signed URL
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Upload failed')
      return null
    }

    const { signedUrl, publicUrl } = await res.json()

    // Upload to Supabase Storage
    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    if (!uploadRes.ok) {
      setError('Upload failed. Please try again.')
      return null
    }

    return publicUrl
  }

  const handleFiles = async (files: FileList) => {
    const remaining = maxImages - value.length
    if (remaining <= 0) return

    setError('')
    setUploading(true)

    const toUpload = Array.from(files).slice(0, remaining)
    const urls: string[] = []

    for (const file of toUpload) {
      const url = await uploadFile(file)
      if (url) urls.push(url)
    }

    onChange([...value, ...urls])
    setUploading(false)
  }

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {value.map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" sizes="100px" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-xs">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      <p className="text-xs text-gray-400">Up to {maxImages} images, 5MB each</p>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
