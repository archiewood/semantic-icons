import { writeFileSync } from 'fs';
import { iconsData } from '../src/lib/icons-data.js';
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

interface IconData {
	name: string;
	description: string;
	searchText: string;
}

interface IconWithEmbedding extends IconData {
	embedding: number[];
}

async function generateEmbeddings() {
	console.log(`Generating embeddings for ${iconsData.length} icons...`);

	const iconsWithEmbeddings: IconWithEmbedding[] = [];

	// Process in batches to avoid rate limits
	const batchSize = 100;
	for (let i = 0; i < iconsData.length; i += batchSize) {
		const batch = iconsData.slice(i, i + batchSize);
		console.log(
			`Processing batch ${i / batchSize + 1}/${Math.ceil(iconsData.length / batchSize)}...`
		);

		const response = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: batch.map((icon) => icon.searchText),
			dimensions: 512 // Reduce from 1536 to 512 for smaller file size (~1/3 size)
		});

		for (let j = 0; j < batch.length; j++) {
			iconsWithEmbeddings.push({
				...batch[j],
				embedding: response.data[j].embedding
			});
		}
	}

	// Save to JSON file in static folder so it can be served
	const outputPath = './static/embeddings.json';
	writeFileSync(outputPath, JSON.stringify(iconsWithEmbeddings, null, 2));

	console.log(`✓ Embeddings saved to ${outputPath}`);
	console.log(`Total icons: ${iconsWithEmbeddings.length}`);
	console.log(`Embedding dimensions: ${iconsWithEmbeddings[0].embedding.length}`);
}

generateEmbeddings().catch(console.error);
