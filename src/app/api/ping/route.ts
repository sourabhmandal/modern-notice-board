import { auth } from "@/components/auth/auth";
import { NextRequest, NextResponse } from "next/server";

async function helloHandler(request: NextRequest) {
  const session = await auth();

  return NextResponse.json(
    { message: "Hello from server", session: session },
    {
      status: 200,
    }
  );
}

export { helloHandler as GET };
