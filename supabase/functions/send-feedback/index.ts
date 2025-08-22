import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Feedback function called')
    
    const { name, email, subject, message, rating } = await req.json()
    console.log('Received data:', { name, email, subject, message, rating })

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('Missing required fields')
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if BREVO_API_KEY is set
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not set')
      throw new Error('BREVO_API_KEY environment variable is not set')
    }

    console.log('Sending email via Brevo API...')
    
    // Send email via Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'KOSC Spitsenspel',
          email: 'noreply@kosc.nl'
        },
        to: [
          {
            email: 'spitsenspelkosc@gmail.com',
            name: 'KOSC Spitsenspel Team'
          }
        ],
        subject: `Feedback KOSC Spitsenspel: ${subject}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #10b981;">KOSC SPITSENSPEL</h1>
              <p style="margin: 10px 0 0 0; color: #9ca3af;">Feedback van gebruiker</p>
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Nieuwe Feedback</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">Naam:</strong>
                <span style="color: #6b7280; margin-left: 10px;">${name}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">Email:</strong>
                <span style="color: #6b7280; margin-left: 10px;">${email}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">Onderwerp:</strong>
                <span style="color: #6b7280; margin-left: 10px;">${subject}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">Beoordeling:</strong>
                <span style="color: #6b7280; margin-left: 10px;">${'⭐'.repeat(rating)}</span>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #374151;">Bericht:</strong>
                <div style="color: #6b7280; margin-top: 10px; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #10b981;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Beantwoord deze feedback
                </a>
              </div>
            </div>
            
            <div style="background-color: #374151; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">© 2025 KOSC Spitsenspel. Alle rechten voorbehouden.</p>
            </div>
          </div>
        `
      })
    })

    console.log('Brevo API response status:', brevoResponse.status)

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text()
      console.error('Brevo API error:', errorData)
      throw new Error(`Failed to send email: ${brevoResponse.status} - ${errorData}`)
    }

    console.log('Email sent successfully')
    
    return new Response(
      JSON.stringify({ success: true, message: 'Feedback sent successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-feedback function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
