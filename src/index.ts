import { sbd_splitter } from "./sentence-splitter/sbd_splitter.js";
import { bm25_search } from "./search-engine/bm25.js";
import { rerank } from "./search-engine/rerank.js";
import { AutoTokenizer, XLMRobertaModel } from "@huggingface/transformers";

function convert_doc_to_arr(results: any[]): string[] {
  return results.map((result) => result.pageContent);
}

export class ClueHunter {
  private model: any;
  private tokenizer: any;
  private bm25_top_k: number;

  constructor(
    model_id?: string,
    device: "cpu" | "webgpu" = "cpu",
    bm25_top_k: number = 50
  ) {
    device = device;
    this.bm25_top_k = bm25_top_k;
    (async () => {
      await this.setupModel(model_id, device);
    })();
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
    const passages = sbd_splitter(parsed_text);

    const searched_passages_doc = await bm25_search(
      answer,
      passages,
      this.bm25_top_k
    );

    const searched_passages_arr = convert_doc_to_arr(searched_passages_doc);

    const reranked_results = await rerank(
      answer,
      searched_passages_arr,
      this.model,
      this.tokenizer,
      { top_k: 1, return_documents: true }
    );

    if (reranked_results.length > 0 && reranked_results[0].text) {
      return reranked_results[0].text;
    } else {
      console.warn("No answer found");
      console.log(`Top-0 sentence: ${reranked_results[0].score}`);
      return "";
    }
  }
}

export { bm25_search, sbd_splitter, rerank };
