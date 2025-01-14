import { sbd_splitter } from "./sentence-splitter/sbd_splitter.js";
import { bm25_search } from "./search-engine/bm25.js";
import { rerank } from "./search-engine/rerank.js";
import { AutoTokenizer, XLMRobertaModel } from "@huggingface/transformers";
import { merge_sentences } from "./search-engine/merge_sentence.js";

function convert_doc_to_arr(results: any[]): string[] {
  return results.map((result) => result.pageContent);
}

export class ClueHunter {
  private model: any;
  private tokenizer: any;
  private bm25_top_k: number;
  private merge_counts: number[];

  constructor(
    model_id?: string,
    device: "cpu" | "webgpu" = "cpu",
    bm25_top_k: number = 50,
    merge_counts: number[] = [2, 3]
  ) {
    this.bm25_top_k = bm25_top_k;
    (async () => {
      await this.setupModel(model_id, device);
    })();
    this.merge_counts = merge_counts
  }

  async setupModel(
    model_id: string = "jinaai/jina-reranker-v1-tiny-en",
    device: "cpu" | "webgpu" = "cpu"
  ): Promise<void> {
    this.model = await XLMRobertaModel.from_pretrained(model_id, {
      device: device,
    });
    this.tokenizer = await AutoTokenizer.from_pretrained(model_id);
  }

  async huntingClues(answer: string, parsed_text: string): Promise<string> {
    console.time("SBD splitting");
    const passages = sbd_splitter(parsed_text);
    console.timeEnd("SBD splitting");

    const merged_sentences = await merge_sentences(passages, this.merge_counts);

    console.time("BM25 search");
    const searched_passages_doc = await bm25_search(
      answer,
      merged_sentences,
      this.bm25_top_k
    );
    console.timeEnd("BM25 search");

    const searched_passages_arr = convert_doc_to_arr(searched_passages_doc);

    console.time("Rerank setup additional time");
    await this.setupModel();
    console.timeEnd("Rerank setup additional time");

    console.time("Rerank");
    const reranked_results = await rerank(
      answer,
      searched_passages_arr,
      this.model,
      this.tokenizer,
      { top_k: 1, return_documents: true }
    );
    console.timeEnd("Rerank");

    if (reranked_results.length > 0 && reranked_results[0].text) {
      return reranked_results[0].text;
    } else {
      console.warn("No answer found");
      console.log(`Top-0 sentence: ${reranked_results[0].score}`);
      return "";
    }
  }
}

export { bm25_search, sbd_splitter, rerank, merge_sentences };
