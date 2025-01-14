export async function merge_sentences(sentences: string[], mergeCounts: number[]): Promise<string[]> {
    const result: string[] = [...sentences]; // Include original sentences
  
    for (const count of mergeCounts) {
      for (let i = 0; i <= sentences.length - count; i++) {
        const mergedSentence = sentences.slice(i, i + count).join(' ');
        result.push(mergedSentence);
        
        await new Promise(resolve => setTimeout(resolve, 10)); // For async
      }
    }
  
    return result;
  }
