import { createServiceClient } from "@/lib/supabase-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        if (!username) {
            return NextResponse.json(
                {error: 'Missing required field: Username'},
                {status: 400}
            );
        }

        if (!email) {
            return NextResponse.json(
                {error: 'Missing required field: Email'},
                {status: 400}
            );
        }

        if (!password) {
            return NextResponse.json(
                {error: 'Missing required field: Password'},
                {status: 400}
            );
        }

        const serviceClient = createServiceClient();

        // Check if user_name exists
        const { data: existingUser, error: userCheckError } = await serviceClient
            .from('users')
            .select('user_name')
            .eq('user_name', username)
            .maybeSingle()

        if (userCheckError) {
            console.error('Username check error:', userCheckError);
            return NextResponse.json(
                { error: "An error occurred while checking user existence." },
                { status: 500 }
            )
        }

        if (existingUser) {
            return NextResponse.json(
                { error: "Username already exists." },
                { status: 409 }
            )
        }

        // Create user
        const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true, 
            user_metadata: { username } 
        });

        if (authError) {
            console.error('Supabase Auth error:', authError);

            // Handle duplicate email natively thrown by Supabase
            if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('exists')) {
                return NextResponse.json(
                    { error: 'Email already exists.' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'User registered successfully!', userId: authData.user.id },
            { status: 201 }
        );

    } catch (err) {
        console.error('Unhandled server error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}