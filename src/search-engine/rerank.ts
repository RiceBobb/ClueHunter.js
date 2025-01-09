import { AutoTokenizer, XLMRobertaModel } from '@xenova/transformers';

let model: any;
let tokenizer: any;

async function setupModel() {
    const model_id = 'jinaai/jina-reranker-v1-tiny-en';
    model = await XLMRobertaModel.from_pretrained(model_id);
    tokenizer = await AutoTokenizer.from_pretrained(model_id);
}

export async function rerank(
    query: string,
    documents: string[],
    options: {
        top_k?: number;
        return_documents?: boolean;
    } = {}
): Promise<{ corpus_id: number; score: number; text?: string }[]> {
    if (!model || !tokenizer) {
        await setupModel();
    }

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
