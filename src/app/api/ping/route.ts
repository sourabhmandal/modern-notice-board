import { NextResponse } from "next/server";

async function helloHandler(request: Request) {
  return NextResponse.json(
    { message: "Hello from server" },
    {
      status: 200,
    }
  );
}

export { helloHandler as GET };
