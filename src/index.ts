import { sbd_splitter } from "./sentence-splitter/sbd_splitter.js";
import { bm25_search } from "./search-engine/bm25.js";
import { rerank } from "./search-engine/rerank.js";

type Splitter = typeof sbd_splitter;
type SearchEngine = typeof bm25_search;
type Reranker = typeof rerank;

function convert_doc_to_arr(results: any[]): string[] {
  return results.map((result) => result.pageContent);
}

export async function clueHunt(
  answer: string,
  parsed_text: string,
  bm25_top_k: number = 50,
  device: "cpu" | "webgpu" = "cpu",
) {

  const passages = sbd_splitter(parsed_text);

  const searched_passages_doc = await bm25_search(
    answer,
    passages,
    bm25_top_k
  );

  const searched_passages_arr = convert_doc_to_arr(searched_passages_doc);

  const reranked_results = await rerank(answer, searched_passages_arr, {
    top_k: 1,
    return_documents: true,
    device: device,
  });

  return reranked_results[0].text;
}

export { bm25_search, sbd_splitter, rerank };
