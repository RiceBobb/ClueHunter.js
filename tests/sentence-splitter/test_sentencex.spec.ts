import { describe, it } from "mocha";
import { expect } from "chai";
import { wink_splitter } from "@rice-bobb/cluehunter";
import { bm25_search } from "@rice-bobb/cluehunter";

const test_en_paragraph = `Truman stepped outside to a strange morning where a fallen stage light labeled "Sirius (9 Canis Major)" sparked his curiosity, leading to an eerie drive with a radio broadcasting his every move, and culminating in a beachside reflection on Sylvia's warning about being watched, leaving him to question the authenticity of his life.`;
const test_ko_paragraph = '맨까 새끼들 부들부들하구나 억까를 해 봐도 우린 골 넣지 니네가 아무리 맹구다 어쩐다고 놀려도 아아~ 즐겁구나 오 늘 이~(짜스!) 맨까 새끼들 부들부들하구나 살짝쿵 설렜니 아니 안 되지 이겨도 지랄 져도 지랄 뭐만 하면 리그컵 아~ 리그컵도 축 군 데~ (컴온!!) 맨까 새끼들 부들부들하구나 돌아온 미친 폼 누가 막을래? 더 보기 리그 탈출 직전 돌아와요 맨유 팬! 아~ 기대된다 챔 스 가~ Siuuuuuuu!';

describe("Wink splitter sentence splitter test", async () => {
  it("1) English sentence split", async () => {
    const result = wink_splitter(test_en_paragraph);

    expect(result).to.be.an("Document");
    expect(result).to.have.lengthOf(6);
    expect(result[0]).to.equal("This is an example of an English paragraph.");
  });

  it("2) Korean sentence split", async () => {
    const result = wink_splitter(test_ko_paragraph);

    expect(result).to.be.an("Document");
    expect(result).to.have.lengthOf(6);
    expect(result[0]).to.equal("This is an example of an Korean paragraph.");
  });

  it("3) Split English sentence bm25 test", async () => {
    const searched_en_passages = wink_splitter(test_en_paragraph);
    const query = "Who is Truman?";
    const results = await bm25_search(query, searched_en_passages);
    console.log(results);
  });

});
