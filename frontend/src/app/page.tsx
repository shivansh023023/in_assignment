import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Star, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-1');

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-accent" />,
      title: 'Discover New Reads',
      description: 'Explore a vast collection of books across all genres. Find your next favorite book with ease.',
    },
    {
      icon: <Star className="w-8 h-8 text-accent" />,
      title: 'Share Your Thoughts',
      description: 'Write insightful reviews and rate the books you\'ve read. Help others in the community make their choice.',
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: 'Join the Community',
      description: 'Connect with fellow book lovers. Discuss your favorite characters, plot twists, and literary moments.',
    },
  ];

  return (
    <div className="flex-1 bg-background">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main>
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            {heroImage && (
               <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
               />
            )}
          </div>
          <div className="container mx-auto px-4 relative text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">
              Welcome to BookWise
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 mb-8">
              Your personal corner for discovering, reading, and reviewing the books that shape our world.
            </p>
            <Button size="lg" asChild>
              <Link href="/books">
                Explore Books <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold mb-2">Why BookWise?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the tools and community to enhance your reading journey.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {features.map((feature, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-headline font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

       <footer className="py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BookWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
