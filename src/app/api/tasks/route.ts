import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Task } from '@/models/Schemas';

export async function GET(req: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');

    let query = {};

    if (start && end) {
        query = {
            $or: [
                { startDate: { $lte: new Date(end) }, endDate: { $gte: new Date(start) } }
            ]
        };
    }

    const tasks = await Task.find(query).sort({ startDate: -1 });
    console.log(tasks);
    return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();

    const newTask = await Task.create({
      projectId: body.projectId,
      description: body.description,
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : null,
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(),
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}