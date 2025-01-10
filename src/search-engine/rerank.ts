import { AutoTokenizer, XLMRobertaModel } from "@huggingface/transformers";

let model: any;
let tokenizer: any;

async function setupModel(
  model_id: string = "jinaai/jina-reranker-v1-tiny-en",
  webgpu_enabled: boolean = true
): Promise<void> {
  const options: { device?: 'webgpu' } = webgpu_enabled ? { device: 'webgpu' } : {};
  
  model = await XLMRobertaModel.from_pretrained(model_id, options);
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

  const inputs = tokenizer(new Array(documents.length).fill(query), {
    text_pair: documents,
    padding: true,
    truncation: true,
  });

  console.time("rerank model inference");
  const { logits } = await model(inputs);
  console.timeEnd("rerank model inference");
  return logits
    .sigmoid()
    .tolist()
    .map(([score]: [number], i: number) => ({
      corpus_id: i,
      score,
      ...(return_documents ? { text: documents[i] } : {}),
    }))
    .sort(
      (
        a: { corpus_id: number; score: number; text?: string },
        b: { corpus_id: number; score: number; text?: string }
      ) => b.score - a.score
    )
    .slice(0, top_k);
}
