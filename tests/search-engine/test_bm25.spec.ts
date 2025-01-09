import { describe, it } from "mocha";
import { expect } from "chai";
import { bm25_search } from "@rice-bobb/cluehunter";

const ko_sample_passage_list = [
  "맨까 새끼들 부들부들하구나",
  "억까를 해 봐도 우린 골 넣지",
  "니네가 아무리 맹구다 어쩐다고 놀려도",
  "아아~ 즐겁구나 오 늘 이~(짜스!)",
  "맨까 새끼들 부들부들하구나",
  "살짝쿵 설렜니 아니 안 되지",
  "이겨도 지랄 져도 지랄 뭐만 하면 리그컵",
  "아~ 리그컵도 축 군 데~ (컴온!!)",
  "맨까 새끼들 부들부들하구나",
  "돌아온 미친 폼 누가 막을래?",
  "더 보기 리그 탈출 직전 돌아와요 맨유 팬!",
  "아~ 기대된다 챔 스 가~ Siuuuuuuu!",
];

const en_sample_passage_list = [
  "Truman opened his front door and stepped outside.",
  "The morning sun greeted him, but something felt different.",
  "He looked up and noticed a stage light had fallen from the sky, shattering on the pavement.",
  "Picking it up, he read the label: 'Sirius (9 Canis Major)'.",
  "His heart raced. A star falling from the sky? Impossible.",
  "Truman glanced around, searching for someone—anyone—who could explain this.",
  "But the street was unusually empty.",
  "Driving to work later that morning, Truman turned on the radio.",
  "Static filled the car before a voice crackled through.",
  "'He's turning onto Main Street now. Keep the bus in position.'",
  "Truman's hands froze on the wheel.",
  "The voice was talking about him.",
  "Panic rising, he spun the dial, but every channel was the same—monitoring his movements.",
  "That evening, Truman sat on the beach, staring at the horizon.",
  "He remembered Sylvia, the woman who had tried to warn him.",
  "'They’re watching you, Truman!' she had shouted before being dragged away.",
  "Her words echoed in his mind.",
  "Could it be true? Was his entire life a lie?",
];

function validation_results(results: any[], test_passage_list: any[]) {
  expect(results).to.be.an("array");
  expect(results[0].pageContent).to.be.an("string");
  expect(results[0].metadata.bm25Score).to.be.an("number");

  expect(results.length).to.be.greaterThan(0);
  expect(results).to.have.lengthOf(test_passage_list.length);
  expect(results[0].metadata.bm25Score).to.be.greaterThanOrEqual(
    results[1].metadata.bm25Score
  );
}

describe("Bm25 Sample Test Suite", async () => {
  it("Bm25 Korean sample data test", async () => {
    const query = "맨까 새끼들은 어떤 감정이야?";
    const results = await bm25_search(query, ko_sample_passage_list);
    validation_results(results, ko_sample_passage_list);
  });

  it("Bm25 English sample data test", async () => {
    const query = "Who is Truman?";
    const results = await bm25_search(query, en_sample_passage_list);
    validation_results(results, en_sample_passage_list);
  });
});
