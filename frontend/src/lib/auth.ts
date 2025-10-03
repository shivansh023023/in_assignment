import jwt from 'jsonwebtoken';
import {cookies} from 'next/headers';
import dbConnect from './db';
import type {IUser} from './definitions';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface UserPayload {
  userId: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: '7d'});
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(): Promise<IUser | null> {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  try {
    const { db } = await dbConnect();
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) }, { projection: { password: 0 }});
    if (!user) return null;
    
    return JSON.parse(JSON.stringify(user)) as IUser;
  } catch (error) {
    console.error("Failed to fetch session user:", error);
    return null;
  }
}
