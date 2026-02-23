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

// POST a new project
export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const body = await req.json();

        const newProject = await Project.create({
            title: body.title,
            companyName: body.companyName,
            description: body.description,
            compensation: Number(body.compensation),
            compensationRate: body.compensationRate,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            cumulatedCompensation: 0
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
