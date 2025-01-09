import { AutoTokenizer, AutoModelForSequenceClassification } from '@xenova/transformers';

/**
 * Performs ranking with the CrossEncoder on the given query and documents. Returns a sorted list with the document indices and scores.
 * @param query A single query
 * @param documents A list of documents
 * @param options Options for ranking
 * @param options.top_k Return the top-k documents. If undefined, all documents are returned.
 * @param options.return_documents If true, also returns the documents. If false, only returns the indices and scores.
 * @returns A sorted list with document indices, scores, and optionally the text.
 */
export async function rank(
    query: string,
    documents: string[],
    options: {
        top_k?: number;
        return_documents?: boolean;
    } = {}
): Promise<{ corpus_id: number; score: number; text?: string }[]> {
    const model_id = 'jinaai/jina-reranker-v1-tiny-en';
    const model = await AutoModelForSequenceClassification.from_pretrained(model_id, { quantized: false });
    const tokenizer = await AutoTokenizer.from_pretrained(model_id);

    const { top_k = undefined, return_documents = false } = options;

    const inputs = tokenizer(
        new Array(documents.length).fill(query),
        { text_pair: documents, padding: true, truncation: true }
    );

    const { logits } = await model(inputs);
    return logits.sigmoid().tolist()
        .map(([score]: [number], i: number) => ({
            corpus_id: i,
            score,
            ...(return_documents ? { text: documents[i] } : {})
        }))
        .sort((a: { corpus_id: number; score: number; text?: string }, 
            b: { corpus_id: number; score: number; text?: string }) => b.score - a.score)
        .slice(0, top_k);
}
