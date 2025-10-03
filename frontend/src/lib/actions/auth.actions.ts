'use server';

import {z} from 'zod';
import bcrypt from 'bcryptjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import dbConnect from '@/lib/db';
import {signToken} from '@/lib/auth';
import type {AuthFormState} from '@/lib/definitions';

const SignupSchema = z.object({
  name: z.string().min(2, {message: 'Name must be at least 2 characters.'}),
  email: z.string().email({message: 'Please enter a valid email.'}),
  password: z.string().min(6, {message: 'Password must be at least 6 characters.'}),
});

const LoginSchema = z.object({
  email: z.string().email({message: 'Please enter a valid email.'}),
  password: z.string().min(1, {message: 'Password is required.'}),
});

export async function signup(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
      success: false,
    };
  }

  const {name, email, password} = validatedFields.data;

  try {
    const { db } = await dbConnect();

    const existingUser = await db.collection('users').findOne({email});

    if (existingUser) {
      return {message: 'User with this email already exists.', success: false};
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({
        name, 
        email, 
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    
  } catch (error) {
    console.error(error);
    return {message: 'An unexpected error occurred.', success: false};
  }
  
  redirect('/login?message=Signup successful. Please log in.');
}

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      success: false,
    };
  }

  const {email, password} = validatedFields.data;

  try {
    const { db } = await dbConnect();
    const user = await db.collection('users').findOne({email});
    if (!user) {
      return {message: 'Invalid credentials.', success: false};
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return {message: 'Invalid credentials.', success: false};
    }

    const token = signToken({userId: user._id.toString()});

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
  } catch (error) {
    console.error(error);
    return {message: 'An unexpected error occurred.', success: false};
  }

  redirect('/books');
}


export async function logout() {
    cookies().delete('token');
    redirect('/');
}
