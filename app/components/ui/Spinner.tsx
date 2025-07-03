'use client'

import { Loader2 } from 'lucide-react'

const Spinner = ({ className = '' }: { className?: string }) => {
  return (
    <div className="flex justify-center items-center py-6">
      <Loader2 className={`h-5 w-5 animate-spin text-purple-600 ${className}`} />
    </div>
  )
}

export default Spinner