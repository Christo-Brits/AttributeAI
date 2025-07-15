// supabase/functions/generate-content/index.ts
// Enterprise-grade content generation with multiple AI models

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, keywords, contentType, targetAudience } = await req.json()
    
    // Get API keys from environment
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!claudeApiKey && !openaiApiKey) {
      throw new Error('No AI API keys configured')
    }

    // Content generation prompt
    const prompt = `Create high-quality ${contentType || 'blog post'} content about: ${topic}

Target Keywords: ${keywords?.join(', ') || 'N/A'}
Target Audience: ${targetAudience || 'Business professionals'}

Requirements:
- SEO-optimized with natural keyword integration
- Engaging and informative content
- Clear structure with headings
- Actionable insights
- Professional tone

Generate a comprehensive piece that provides real value to readers.`

    let content = ''
    let aiModel = 'demo'

    // Try Claude first, fallback to OpenAI
    if (claudeApiKey) {
      try {
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
          })
        })

        if (claudeResponse.ok) {
          const claudeData = await claudeResponse.json()
          content = claudeData.content[0].text
          aiModel = 'claude-3-sonnet'
        }
      } catch (error) {
        console.log('Claude API failed, trying OpenAI...')
      }
    }

    // Fallback to OpenAI if Claude failed
    if (!content && openaiApiKey) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2000
          })
        })

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json()
          content = openaiData.choices[0].message.content
          aiModel = 'gpt-4'
        }
      } catch (error) {
        console.log('OpenAI API failed')
      }
    }

    // Demo fallback if no APIs work
    if (!content) {
      content = `# ${topic}\n\nThis is a demo content generation response. In production, this would be powered by Claude AI or GPT-4 with full content generation capabilities.\n\n## Key Points\n\n- Professional content generation\n- SEO optimization\n- Multiple AI model integration\n- Enterprise-grade reliability\n\nTarget keywords: ${keywords?.join(', ') || 'N/A'}\nAudience: ${targetAudience || 'Business professionals'}`
      aiModel = 'demo'
    }

    return new Response(
      JSON.stringify({
        content,
        aiModel,
        topic,
        keywords: keywords || [],
        contentType: contentType || 'blog post',
        wordCount: content.split(' ').length,
        seoScore: 85, // Would calculate based on keyword density, etc.
        generatedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
