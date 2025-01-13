import tokenizer from "sbd";

/**
 * Sentence Boundary Detection (SBD) splitter
  optional_options parameter:
  - newline_boundaries, force sentence split at newlines
  - html_boundaries, force sentence split at specific tags (br, and closing p, div, ul, ol)
  - sanitize: If you don't expect nor want html in your text.
  - allowed_tags: To sanitize html, the library santize-html is used. You can pass the allowed tags option.
  - preserve_whitespace: Preserve the literal whitespace between words and sentences (otherwise, internal spaces are normalized to a single space char, and inter-sentence whitespace is omitted). Preserve whitespace has no effect if either newline_boundaries or html_boundaries is specified.
  - abbreviations: list of abbreviations to override the original ones for use with other languages. Don't put dots in your custom abbreviations.
 */

export function sbd_splitter(parsed_text: string): string[] {
  if (!parsed_text) {
    throw new Error("Parsed text and contents must be provided");
  }

  var optional_options = {};
  var passages = tokenizer.sentences(parsed_text, optional_options);

  return passages;
}
