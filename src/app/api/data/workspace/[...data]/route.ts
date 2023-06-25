import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");
  const workspace = await prisma.workspace.findMany({
    where: {
      email: session.user?.email,
    },
  });
  return NextResponse.json(workspace);
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  if (!session) throw new Error("Not authenticated");
  const workspace = await prisma.user.update({
    where: {
      email: session.user?.email!,
    },
    data: {
      workspaces: {
        create: [
          {
            name: body.name,
          },
        ],
      },
    },
  });
  return NextResponse.json(workspace);
}
export async function PATCH(req: Request, { params }: { params: { data: string[] } }) {
  const [id, name] = params.data;
  const workspace = await prisma.workspace.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
  return NextResponse.json(workspace);
}
//to change it to deleted or not
export async function DELETE(req: Request, { params }: { params: { data: string[] } }) {
  const [id] = params.data;
  const workspace = await prisma.workspace.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json(workspace);
}