import { sbd_splitter } from "./sentence-splitter/sbd_splitter.js";
import { bm25_search } from "./search-engine/bm25.js";
import { rerank } from "./search-engine/rerank.js";

function convert_doc_to_arr(results: any[]): string[] {
  return results.map((result) => result.pageContent);
}

export class ClueHunter {
  private device: "cpu" | "webgpu";
  private bm25_top_k: number;

  constructor(device: "cpu" | "webgpu" = "cpu", bm25_top_k: number = 50) {
    this.device = device;
    this.bm25_top_k = bm25_top_k;
  }

  async clueHunt(answer: string, parsed_text: string): Promise<string> {
    const passages = sbd_splitter(parsed_text);

    const searched_passages_doc = await bm25_search(
      answer,
      passages,
      this.bm25_top_k
    );

    const searched_passages_arr = convert_doc_to_arr(searched_passages_doc);

    const reranked_results = await rerank(answer, searched_passages_arr, {
      top_k: 1,
      return_documents: true,
      device: this.device,
    });


    if (reranked_results.length > 0 && reranked_results[0].text) {
      return reranked_results[0].text;
    } else {
      console.warn("No answer found");
      console.log(`Top-0 sentence: ${reranked_results[0].score}`);
      return "No answer found";
    }
  }
}

export { bm25_search, sbd_splitter, rerank };
