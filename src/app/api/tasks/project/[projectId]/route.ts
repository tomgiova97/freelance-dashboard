import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Task } from '@/models/Schemas';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        await connectDB();
        
        const { projectId } = await params;

        const tasks = await Task.find({ projectId: projectId });

        return NextResponse.json(tasks);
        
    } catch (error) {
        console.error("Fetch Tasks by Project Error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks for this project' }, 
            { status: 500 }
        );
    }
}