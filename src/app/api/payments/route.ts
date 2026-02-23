import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Payment, Project } from '@/models/Schemas';

export async function GET(req: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    let totalGain = 0;

    let query = {};

    if (start && end) {
        query = {
            $and: [
                { date: { $lte: new Date(end) } }, { date: { $gte: new Date(start) } }
            ]
        }
    };

    const payments = await Payment.find(query).sort({ startDate: -1 });
    payments.forEach(p => totalGain += p.amount);

    return NextResponse.json({
        payments: payments,
        totalGain: totalGain
    });
}


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // 1. Create the new payment
        const newPayment = await Payment.create({
            projectId: body.projectId,
            amount: Number(body.amount),
            currency: body.currency || 'USD',
            date: body.date ? new Date(body.date) : new Date(),
        });

        console.log(newPayment)

        const project = await Project.findOne({ id: body.projectId });
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        await Project.findOneAndUpdate(
            { id: body.projectId },
            { $inc: { cumulatedCompensation: Number(body.amount) } }
        );

        return NextResponse.json(newPayment, { status: 201 });
    } catch (error: any) {
        console.error("PAYMENT SAVE ERROR:", error); // <-- log the full error
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
