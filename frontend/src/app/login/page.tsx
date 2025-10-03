import { AuthForm } from '@/components/auth/AuthForm';
import { login } from '@/lib/actions/auth.actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <>
      {searchParams.message && (
        <div className="absolute top-20 w-full flex justify-center">
            <Alert className="max-w-md bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{searchParams.message}</AlertDescription>
            </Alert>
        </div>
      )}
      <AuthForm type="login" action={login} />
    </>
  );
}
