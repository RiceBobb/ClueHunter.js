export async function rerank(
  query: string,
  documents: string[],
  model: any,
  tokenizer: any,
  options: {
    top_k?: any;
    return_documents?: boolean;
  } = {}
): Promise<{ corpus_id: number; score: number; text?: string }[]> {

  const { 
    top_k = undefined, 
    return_documents = false,
  } = options;

  if (!model || !tokenizer) {
    throw new TypeError("Model and tokenizer must be provided");
  }

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
