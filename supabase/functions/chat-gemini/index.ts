import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  userId?: string;
}

interface DocumentChunk {
  id: number;
  content: string;
  metadata: any;
  similarity?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId }: ChatRequest = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('Google API key not configured');
    }

    console.log('Received chat message:', { message, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search for relevant documents using text search
    // Note: This is a simplified approach. For better results, you'd want to use embeddings
    const { data: documents, error: searchError } = await supabase
      .from('documents')
      .select('id, content, metadata')
      .textSearch('content', message, { type: 'websearch' })
      .limit(5);

    if (searchError) {
      console.error('Error searching documents:', searchError);
    }

    const relevantDocs = documents || [];
    console.log(`Found ${relevantDocs.length} relevant documents`);

    // Prepare context from retrieved documents
    const context = relevantDocs
      .map((doc, index) => `Documento ${index + 1}:\n${doc.content}`)
      .join('\n\n---\n\n');

    // Prepare the prompt for Gemini
    const systemPrompt = `Você é ChatBW, assistente interno da empresa especializado em procedimentos e documentação técnica. 

INSTRUÇÕES:
- Responda sempre em português brasileiro
- Use a documentação fornecida para dar respostas precisas e específicas
- Se não houver informação suficiente na documentação, seja claro sobre isso
- Formate sua resposta usando Markdown para melhor legibilidade
- Mantenha um tom profissional mas acessível

CONTEXTO DA DOCUMENTAÇÃO:
${context}

PERGUNTA DO USUÁRIO: ${message}

Por favor, forneça uma resposta detalhada baseada na documentação disponível.`;

    // Call Google Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status, geminiResponse.statusText);
      const errorText = await geminiResponse.text();
      console.error('Gemini API error details:', errorText);
      throw new Error(`Gemini API request failed: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');

    // Extract the generated text
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';

    // Prepare source references
    const sources = relevantDocs.map(doc => ({
      title: doc.metadata?.title || `Documento ${doc.id}`,
      path: doc.metadata?.path || `/docs/document-${doc.id}`,
      excerpt: doc.content.substring(0, 150) + (doc.content.length > 150 ? '...' : '')
    }));

    // Return the response with sources
    return new Response(
      JSON.stringify({ 
        response: generatedText,
        sources: sources,
        status: 'success' 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in chat-gemini function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao processar mensagem com Gemini', 
        details: error.message,
        status: 'error'
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      }
    );
  }
});