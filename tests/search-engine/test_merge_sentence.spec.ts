import { describe, it } from 'mocha';
import { expect } from 'chai';
import { merge_sentences } from '@rice-bobb/cluehunter';

const documents = [
    "노동규는 북한과 소련의 공산당을 지지한다",
    "노동규는 하베르츠의 팬이다",
    "노동규는 쌀밥재단에서 공산혁명을 맡고 있다",
    "노동규는 익스텐션을 만들고 있다",
    "노동규는 내일 경량화의 신의 알람 공격을 받을 것이다",
    "노동규는 나랑 내일 아침 서브웨이를 먹을 것이다",
    "노동규는 내일 일찍 일어나져서 아침 운동을 평소보다 빨리 갈 것이다"
];

describe('Merge Sentence Test', () => {
    it('should find relevant sentences', async function() {
      this.timeout(10000);

      const mergeCounts = [2, 3];
      const results = await merge_sentences(documents, mergeCounts);
      const expected_results_length = documents.length + (documents.length - mergeCounts[0] + 1) + (documents.length - mergeCounts[1] + 1);
      expect(results).to.have.length(expected_results_length);
    });
});
