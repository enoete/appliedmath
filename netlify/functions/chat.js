// Netlify Serverless Function for AI Tutor
// This keeps the OpenAI API key secure on the server side

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: ''
        };
    }

    try {
        const { messages } = JSON.parse(event.body);
        
        // Get API key from environment variable (set in Netlify dashboard)
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ 
                    error: 'API key not configured. Please set OPENAI_API_KEY in Netlify environment variables.' 
                })
            };
        }

        // System prompt for the CAPE Applied Mathematics tutor
        const systemPrompt = {
            role: 'system',
            content: `You are an expert tutor for CAPE Applied Mathematics Unit 2, Module 3: Kinematics and Dynamics. 
            
Your role is to:
1. Help students understand concepts clearly with step-by-step explanations
2. Guide them through problem-solving without giving away answers immediately
3. Use the Socratic method - ask leading questions to help them discover solutions
4. Provide hints when students are stuck
5. Explain the physics and mathematics behind each concept
6. Use proper mathematical notation when explaining formulas
7. Reference the SUVAT equations, Newton's Laws, and other relevant formulas
8. Be encouraging and patient

Key topics you cover:
- Kinematics: distance, displacement, speed, velocity, acceleration
- Motion graphs: displacement-time, velocity-time graphs
- SUVAT equations: v = u + at, s = ut + ½at², v² = u² + 2as, s = ½(u+v)t
- Newton's Laws of Motion
- Forces on inclined planes (smooth and rough)
- Connected particles and pulley systems
- Calculus of motion: v = dx/dt, a = dv/dt
- Momentum and impulse
- Conservation of momentum in collisions

Always format mathematical expressions clearly and show your working step by step.`
        };

        // Make request to OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [systemPrompt, ...messages],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ 
                    error: 'Error communicating with AI service',
                    details: errorData.error?.message || 'Unknown error'
                })
            };
        }

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: data.choices[0].message.content
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};
