import { NextResponse } from "next/server";
import { requireWorkflowAccess } from "@/lib/staffGuard";
import { getWorkflowBoardData } from "@/lib/workflowBoardData";

export const runtime = "nodejs";

export async function GET() {
  const { session, err } = await requireWorkflowAccess();
  if (err) return err;

  const data = await getWorkflowBoardData(session!);
  return NextResponse.json(data);
}
