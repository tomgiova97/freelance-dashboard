import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Project } from '@/models/Schemas';

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

    const projects = await Project.find(query).sort({ startDate: -1 });
    return NextResponse.json(projects);
}