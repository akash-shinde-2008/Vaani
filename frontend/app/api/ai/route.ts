import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GoogleGenAI } from '@google/genai';

const RequestSchema = z.object({
  prompt: z.string().min(1),
  language: z.enum(['en', 'hi'])
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Ignored in API route
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { prompt, language } = parsed.data;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = "You are Vaani, a super friendly, warm, and encouraging career coach for students in India. You give supportive, actionable advice tailored to the student's specific situation. Your tone should be upbeat and approachable, like a helpful older sibling or friend. You never give generic answers or sound strict. Respond in the same language the student used (English or Hindi). If Hindi, respond in natural conversational Hindi using Devanagari script. Structure your response in 2 to 3 short paragraphs. Start with a direct, friendly answer. Then give 1 to 2 concrete next steps. End with one gentle question that helps the student think deeper. Write exactly like a real, caring person talking to a student.";

    const timeoutPromise = new Promise((_, reject) => {
      const signal = AbortSignal.timeout(60000);
      signal.addEventListener('abort', () => reject(new Error('Request timed out')));
    });

    let response: any;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const responsePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { systemInstruction: systemInstruction }
        });
        response = await Promise.race([responsePromise, timeoutPromise]);
        break; // Success
      } catch (e: any) {
        attempts++;
        if (attempts >= maxAttempts) throw e;
        
        // If it's a 503 or 429, wait before retrying (exponential backoff)
        if (e.status === 503 || e.status === 429 || (e.message && (e.message.includes('503') || e.message.includes('429')))) {
          await new Promise(resolve => setTimeout(resolve, attempts * 1500));
        } else {
          throw e; // Unrecoverable error
        }
      }
    }

    if (response && response.text) {
      return NextResponse.json({ response: response.text });
    } else {
      return NextResponse.json({ error: 'No response from AI' });
    }

  } catch (error: any) {
    console.error('AI Route Error:', error);
    if (error.message === 'Request timed out' || error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' });
  }
}
