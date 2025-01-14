import winkNLP from "wink-nlp";
import en_model from "wink-eng-lite-web-model";
import { Document } from "@langchain/core/documents";

export function wink_splitter(parsed_text: string): string[] {
  if (!parsed_text) {
    throw new Error("Parsed text and contents must be provided");
  }

  const nlp = winkNLP(en_model);
  const doc = nlp.readDoc(parsed_text);

  const passages = doc.sentences().out();

  return passages;
}
