import { AuthForm } from '@/components/auth/AuthForm';
import { signup } from '@/lib/actions/auth.actions';

export default function SignupPage() {
  return <AuthForm type="signup" action={signup} />;
}
