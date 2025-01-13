import tokenizer from "sbd";

export function sbd_splitter(parsed_text: string): string[] {
  if (!parsed_text) {
    throw new Error("Parsed text and contents must be provided");
  }

  var optional_options = {};
  var passages = tokenizer.sentences(parsed_text, optional_options);

  return passages;
}
