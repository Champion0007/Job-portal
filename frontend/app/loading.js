export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-6 w-40 h-40">
          {/* Plain <img> ensures the public file is used directly without next/image optimization issues */}
          {/* <img src="/logo.png" alt="Logo" width={160} height={160} className="object-contain mx-auto animate-pulse" /> */}
        </div>
        {/* <div className="mx-auto w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" /> */}
      </div>
    </div>
  )
}
