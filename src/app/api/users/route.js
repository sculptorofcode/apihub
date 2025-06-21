import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const { username, email } = await req.json();

    // Validate required fields
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      username,
      email: email || undefined, // Only set email if provided
    });

    const savedUser = await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        joinedAt: savedUser.joinedAt
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get all users
    const users = await User.find({}).sort({ joinedAt: -1 }).limit(20);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        joinedAt: user.joinedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
