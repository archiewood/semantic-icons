import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	const { text } = await request.json();

	if (!text || typeof text !== 'string') {
		return json({ error: 'Invalid text input' }, { status: 400 });
	}

	try {
		const response = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: text,
			dimensions: 512 // Match the dimensions used in generate-embeddings script
		});

		return json({ embedding: response.data[0].embedding });
	} catch (error) {
		console.error('Error generating embedding:', error);
		return json({ error: 'Failed to generate embedding' }, { status: 500 });
	}
};
