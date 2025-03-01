import { UploadButton } from "@/components/uploadthing"
import { FileList } from "@/components/file-list"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Image Uploader</h1>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Images (Max 4MB)</h2>
          <UploadButton />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Uploads</h2>
            <FileList />
          </div>
        </div>
      </div>
    </main>
  )
}

