import Link from 'next/link';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-2xl font-headline font-bold text-primary", className)}>
      <BookMarked className="h-6 w-6" />
      <span>BookWise</span>
    </Link>
  );
}
