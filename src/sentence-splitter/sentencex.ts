import winkNLP from 'wink-nlp';
import en_model from 'wink-eng-lite-web-model';
import { Document } from "@langchain/core/documents";

function convert_arr_to_doc(split_text_arr: string[]): Document[] {
    return split_text_arr.map((sentence) => ({
      pageContent: sentence,
      metadata: {},
    }));
}

export function wink_splitter(parsed_text: string): Document[] {
    const nlp = winkNLP( en_model );
    const doc = nlp.readDoc( parsed_text );

    const sentences = doc.sentences().out();
    const passages = convert_arr_to_doc( sentences );    

    console.log( passages );

    return passages;
}
