'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { AuthFormState } from '@/lib/definitions';
import { Logo } from '../Logo';

interface AuthFormProps {
  type: 'login' | 'signup';
  action: (prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}

const initialState: AuthFormState = { message: '', success: false };

function SubmitButton({ type }: { type: 'login' | 'signup' }) {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {type === 'login' ? 'Log In' : 'Create Account'}
    </Button>
  );
}

export function AuthForm({ type, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className='mb-8'>
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {type === 'login' ? 'Login' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {type === 'login'
              ? 'Enter your email below to login to your account.'
              : 'Enter your information to create an account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {type === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your Name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {state.message && !state.success && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <SubmitButton type={type} />
          </form>
          <div className="mt-4 text-center text-sm">
            {type === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline text-accent">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="underline text-accent">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
