import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';

interface User {
  username: string;
  email: string;
}

interface ChangePasswordBody {
  newPassword: string;
  userId: string;
}

interface ChangeUsernameBody {
  newUsername: string;
  userId: string;
}

interface ChangeEmailBody {
  newEmail: string;
  userId: string;
}

interface UpdateProfileBody {
  fullName: string;
  bio: string;
  userId: string;
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('X-User-Id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
  }

  try {
    const [rows] = await db.execute(
      'SELECT username, email FROM admins WHERE id = ?',
      [userId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as User;
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params;

  try {
    const body = await request.json();

    switch (action) {
      case 'change-password':
        return await changePassword(body as ChangePasswordBody);
      case 'change-username':
        return await changeUsername(body as ChangeUsernameBody);
      case 'change-email':
        return await changeEmail(body as ChangeEmailBody);
      case 'update-profile':
        return await updateProfile(body as UpdateProfileBody);
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

async function changePassword(body: ChangePasswordBody) {
  const { newPassword, userId } = body;

  if (!newPassword || !userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const [result] = await db.execute(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ message: 'Failed to update password' }, { status: 500 });
  }
}

async function changeUsername(body: ChangeUsernameBody) {
  const { newUsername, userId } = body;

  if (!newUsername || !userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const [result] = await db.execute(
      'UPDATE admins SET username = ? WHERE id = ?',
      [newUsername, userId]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Username updated successfully' });
  } catch (error) {
    console.error('Username change error:', error);
    return NextResponse.json({ message: 'Failed to update username' }, { status: 500 });
  }
}

async function changeEmail(body: ChangeEmailBody) {
  const { newEmail, userId } = body;

  if (!newEmail || !userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const [result] = await db.execute(
      'UPDATE admins SET email = ? WHERE id = ?',
      [newEmail, userId]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Email change error:', error);
    return NextResponse.json({ message: 'Failed to update email' }, { status: 500 });
  }
}

async function updateProfile(body: UpdateProfileBody) {
  const { fullName, bio, userId } = body;

  if (!fullName || !bio || !userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const [result] = await db.execute(
      'UPDATE admins SET full_name = ?, bio = ? WHERE id = ?',
      [fullName, bio, userId]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
