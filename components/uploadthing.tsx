"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { generateReactHelpers } from "@uploadthing/react"

import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { Button } from "@/components/ui/button"
import { UploadCloud, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()

export function UploadButton() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${res.length} file(s)`,
      })
      setIsUploading(false)
      setFiles([])
      // Refresh the page to show the new uploads
      window.location.reload()
    },
    onUploadError: (error) => {
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive",
      })
      setIsUploading(false)
    },
  })

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return

      const fileList = Array.from(e.target.files)

      // Check if any file exceeds 4MB
      const oversizedFiles = fileList.filter((file) => file.size > 4 * 1024 * 1024)

      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "One or more files exceed the 4MB limit",
          variant: "destructive",
        })
        return
      }

      setFiles(fileList)
    },
    [toast],
  )

  const handleUpload = useCallback(() => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    startUpload(files)
  }, [files, startUpload, toast])

  return (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
        <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload</p>
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Select Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">Selected files:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="mt-2">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  )
}

