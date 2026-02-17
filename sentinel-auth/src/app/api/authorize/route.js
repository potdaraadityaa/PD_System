import { NextResponse } from 'next/server';
import { evaluate, logDecision } from '@/lib/engine';
import { z } from 'zod';

const authorizeSchema = z.object({
    action: z.string().min(1),
    resource: z.string().min(1),
    user: z.object({
        role: z.string()
    }).optional(),
    context: z.any().optional()
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Zod Validation
        const validation = authorizeSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const requestData = validation.data;

        // Evaluate
        const result = evaluate(requestData);

        // Log (fire and forget, or await if critical)
        logDecision(requestData, result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

