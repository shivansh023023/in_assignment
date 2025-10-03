'use client'

import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  totalPages: number
  currentPage: number
}

const PaginationControls: FC<PaginationControlsProps> = ({
  totalPages,
  currentPage,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', page.toString())
    router.push(`?${newSearchParams.toString()}`)
  }

  return (
    <div className='flex gap-2 items-center justify-center mt-8'>
      <Button
        variant="outline"
        disabled={!hasPrevPage}
        onClick={() => handlePageChange(currentPage - 1)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(currentPage + 1)}>
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}

export default PaginationControls
