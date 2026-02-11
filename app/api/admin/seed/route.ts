import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  // Use service role key for admin operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = "jordanmanders@gmail.com"
  const password = "J4164170a!!!"

  // Check if admin already exists
  const { data: existingProfiles } = await supabaseAdmin
    .from("admin_profiles")
    .select("id")
    .eq("email", email)
    .limit(1)

  if (existingProfiles && existingProfiles.length > 0) {
    return NextResponse.json({ message: "Admin already exists" })
  }

  // Create the auth user
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { is_admin: true },
    })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Insert into admin_profiles using service role (bypasses RLS)
  const { error: profileError } = await supabaseAdmin
    .from("admin_profiles")
    .insert({
      id: authData.user.id,
      email,
      is_admin: true,
    })

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: "Admin user created successfully" })
}
