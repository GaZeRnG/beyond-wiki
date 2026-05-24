import { createServiceClient } from "@lib/supabase-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        // Validation
        if (!username?.trim() || !email?.trim() || !password) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            )
        }

        const trimmedUsername = username.trim()
        const trimmedEmail = email.trim()

        if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
            return NextResponse.json(
                { error: "Username must be between 3 and 30 characters." },
                { status: 400 }
            )
        }

        if (!/^[A-Za-z][A-Za-z0-9\-]*$/.test(trimmedUsername)) {
            return NextResponse.json(
                { error: "Username must start with a letter and contain only letters, numbers, or dashes." },
                { status: 400 }
            )
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            return NextResponse.json(
                { error: "Invalid email format." },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long." },
                { status: 400 }
            )
        }

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
            return NextResponse.json(
                { error: "Password must contain at least one number, one lowercase letter, and one uppercase letter." },
                { status: 400 }
            )
        }

        const serviceClient = createServiceClient()

        // Check is user exists
        const { data: existingUser, error: userCheckError } = await serviceClient
            .from('users')
            .select('user_name')
            .eq('user_name', trimmedUsername)
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

        // Check if email exists
        const { data: existingEmail, error: emailCheckError } = await serviceClient
            .from('users')
            .select('user_email, oauth_provider')
            .eq('user_email', trimmedEmail)
            .maybeSingle()

        if (emailCheckError) {
            console.error('Email check error:', emailCheckError);
            return NextResponse.json(
                { error: "Unable to verify email. Please try again." },
                { status: 500 }
            )
        }

        if (existingEmail) {
            const provider = existingEmail.oauth_provider
            
            if (provider && provider !== 'email') {
                return NextResponse.json(
                    { error: `Email is already linked with ${provider} account. Please log in with ${provider}.` },
                    { status: 409 }
                )
            }

            return NextResponse.json(
                { error: "Email already exists." },
                { status: 409 }
            )
        }

        // Create user with supabase auth
        const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
            email: trimmedEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: trimmedUsername,
            },
        })

        if (authError) {
            console.error('Auth creation error:', authError)
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            )
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: "User creation failed." },
                { status: 500 }
            )
        }

        // Insert in users table
        const { error: insertError } = await serviceClient
            .from('users')
            .insert({
                id: authData.user.id,
                user_name: trimmedUsername,
                user_email: trimmedEmail,
                user_pfp: null,
                oauth_provider: 'email',
                oauth_id: null,
            })
        
        if (insertError) {
            console.error('Insert error:', insertError);
            // Attempt to clean up
            await serviceClient.auth.admin.deleteUser(authData.user.id)
            return NextResponse.json(
                { error: "User creation failed." },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true, message: 'Registration successful.' },
            { status: 201 }
        )
    } catch (err) {
        console.error('Registration error:', err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        )
    }
}