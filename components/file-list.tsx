"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface FileInfo {
  url: string
  name: string
  key: string
}

export function FileList() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the list of uploaded files from your backend
    // For this demo, we'll use localStorage to simulate persistence
    const storedFiles = localStorage.getItem("uploadedFiles")
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles))
    }
    setLoading(false)

    // Listen for new uploads from the UploadButton component
    const handleStorage = () => {
      const storedFiles = localStorage.getItem("uploadedFiles")
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-[200px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return <p className="text-gray-500">No files uploaded yet.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <Card key={file.key}>
          <CardContent className="p-4">
            <div className="relative h-[200px] w-full">
              <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover rounded-md" />
            </div>
            <p className="mt-2 text-sm truncate">{file.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

