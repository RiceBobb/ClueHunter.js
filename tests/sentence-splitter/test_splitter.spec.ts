import { describe, it } from "mocha";
import { expect } from "chai";
import { wink_splitter, sbd_splitter } from "@rice-bobb/cluehunter";
import { bm25_search } from "@rice-bobb/cluehunter";

const test_en_paragraph = 
`During my backpacking trip through Southeast Asia, I found myself in a small village in Laos. Eager to experience the local culture, I decided to try a traditional Lao massage. I was led to a dimly lit room with a thin mat on the floor and told to lie down. An elderly woman, tiny but surprisingly strong, entered the room and began the massage.
At first, it was incredibly relaxing. The woman's hands kneaded my tense muscles with expert precision. But then, she started walking on my back.  Yes, walking.  I could hear the cracking of my spine with each step, and I bit my lip to stifle a yelp. I'd had massages before, but this was definitely a new level of intensity.
As if walking on my back wasn't enough, she then proceeded to grab my arms and legs, one by one, and vigorously shake them. I felt like a rag doll being manhandled by a playful child.  I tried to maintain a serene expression, not wanting to offend, but inside I was a mix of terrified and amused.
The grand finale involved her pulling my head back with a sudden jerk, a loud crack echoing through the room.  I was convinced she had just given me whiplash.  But when I sat up, I felt strangely... amazing.  All my tension was gone, and I felt loose and limber.
Despite the initial shock and fear, I left the massage feeling incredibly refreshed and with a funny story to tell.  It was definitely an experience I won't forget, and a testament to the unique cultural practices you can encounter while traveling the world.`;

const test_ko_paragraph = '맨까 새끼들 부들부들하구나. 억까를 해 봐도 우린 골 넣지! 니네가 아무리 맹구다 어쩐다고 놀려도 아아~ 즐겁구나 오 늘 이~ 짜스! 맨까 새끼들 부들부들하구나! 살짝쿵 설렜니. 아니 안 되지! 이겨도 지랄 져도 지랄 뭐만 하면 리그컵. 아~ 리그컵도 축 군 데~ 컴온!! 맨까 새끼들 부들부들하구나~ 돌아온 미친 폼 누가 막을래? 더 보기 리그 탈출 직전 돌아와요! 맨유 팬! 아~ 기대된다 챔 스 가~ Siuuuuuuu!';

//TODO: This paragraph has no punctuation. It does not split sentences correctly. Fix it.
const test_no_punctuation_paragraph = `During my backpacking trip through Southeast Asia I found myself in a small village in Laos Eager to experience the local culture I decided to try a traditional Lao massage I was led to a dimly lit room with a thin mat on the floor and told to lie down An elderly woman tiny but surprisingly strong entered the room and began the massage At first it was incredibly relaxing The woman's hands kneaded my tense muscles with expert precision But then she started walking on my back Yes walking I could hear the cracking of my spine with each step and I bit my lip to stifle a yelp I'd had massages before but this was definitely a new level of intensity As if walking on my back wasn't enough she then proceeded to grab my arms and legs one by one and vigorously shake them I felt like a rag doll being manhandled by a playful child I tried to maintain a serene expression not wanting to offend but inside I was a mix of terrified and amused The grand finale involved her pulling my head back with a sudden jerk a loud crack echoing through the room I was convinced she had just given me whiplash But when I sat up I felt strangely amazing All my tension was gone and I felt loose and limber Despite the initial shock and fear I left the massage feeling incredibly refreshed and with a funny story to tell It was definitely an experience I won't forget and a testament to the unique cultural practices you can encounter while traveling the world`;

function validation_results(results: any[], expected_length: number) {
  expect(results).to.be.an("array");
  expect(results).to.have.lengthOf(expected_length);
}
describe("SBD(Sentence Boundary Detection) splitter sentence splitter test", async () => {
  
  it("1) English sentence split", async () => {
    const results = sbd_splitter(test_en_paragraph);

    validation_results(results, 19);
    expect(results[0]).to.equal("During my backpacking trip through Southeast Asia, I found myself in a small village in Laos.");
  });

  it("2) Korean sentence split", async () => {
    const result = sbd_splitter(test_ko_paragraph);

    validation_results(result, 12);
    expect(result[0]).to.equal("맨까 새끼들 부들부들하구나.");
  });

  it("3) Split English sentence bm25 test", async () => {
    const searched_en_passages = sbd_splitter(test_en_paragraph);
    const query = "Where is the South Asia?";
    const results = await bm25_search(query, searched_en_passages);

    validation_results(results, 19);
    expect(results[0].metadata.bm25Score).to.be.greaterThanOrEqual(
      results[1].metadata.bm25Score
    );
  });
});

// describe("Wink splitter sentence splitter test", async () => {

//   it("1) English sentence split", async () => {
//     const results = wink_splitter(test_en_paragraph);

//     validation_results(results, 19);
//     expect(results[0]).to.equal("During my backpacking trip through Southeast Asia, I found myself in a small village in Laos.");
//   });

//   it("2) Korean sentence split", async () => {
//     const result = wink_splitter(test_ko_paragraph);

//     validation_results(result, 12);
//     expect(result[0]).to.equal("맨까 새끼들 부들부들하구나.");
//   });

//   it("3) Split English sentence bm25 test", async () => {
//     const searched_en_passages = wink_splitter(test_en_paragraph);
//     const query = "Where is the South Asia?";
//     const results = await bm25_search(query, searched_en_passages);

//     validation_results(results, 19);
//     expect(results[0].metadata.bm25Score).to.be.greaterThanOrEqual(
//       results[1].metadata.bm25Score
//     );
//   });

// });
