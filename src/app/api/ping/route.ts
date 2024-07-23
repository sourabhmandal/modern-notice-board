import { NextResponse } from "next/server";

async function helloHandler(request: Request) {
  return NextResponse.json({ message: "Hello from server" });
}

export { helloHandler as GET };
