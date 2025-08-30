import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  userId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { message, userId }: ChatRequest = await req.json();
    
    console.log('Received chat message:', { message, userId });

    // Send message to the webhook
    const webhookUrl = 'http://localhost:5678/webhook-test/b6115aca-da93-45e1-9ed8-277a09c92a97';
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!webhookResponse.ok) {
      console.error('Webhook request failed:', webhookResponse.status, webhookResponse.statusText);
      throw new Error(`Webhook request failed: ${webhookResponse.status}`);
    }

    // Get the response from the webhook
    const webhookData = await webhookResponse.text();
    console.log('Webhook response:', webhookData);

    // Return the webhook response
    return new Response(
      JSON.stringify({ 
        response: webhookData,
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
    console.error('Error in chat-webhook function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao processar mensagem', 
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