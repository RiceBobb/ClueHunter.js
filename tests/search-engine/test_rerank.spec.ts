import { describe, it } from 'mocha';
import { expect } from 'chai';
import { rerank } from '@rice-bobb/cluehunter';
import { AutoTokenizer, XLMRobertaModel } from "@huggingface/transformers";

const query = "노동규는 공산당을 지지한다";
const documents = [
    "노동규는 북한과 소련의 공산당을 지지한다",
    "노동규는 하베르츠의 팬이다",
    "노동규는 쌀밥재단에서 공산혁명을 맡고 있다",
    "노동규는 익스텐션을 만들고 있다",
    "노동규는 내일 경량화의 신의 알람 공격을 받을 것이다",
    "노동규는 나랑 내일 아침 서브웨이를 먹을 것이다",
    "노동규는 내일 일찍 일어나져서 아침 운동을 평소보다 빨리 갈 것이다",
    "Organic food wraps and storage solutions",
    "All-natural pet food for dogs with allergies",
    "Yoga mats made from recycled materials",
    "오늘은 날씨가 맑아서 기분이 좋다.",
    "새로운 프로젝트를 시작하기 전에 계획을 세워야 한다.",
    "커피 한 잔 마시면서 책 읽는 시간을 좋아한다.",
    "매일 조금씩 운동을 하면 건강이 좋아진다.",
    "친구와 함께 여행을 떠나는 것은 좋은 추억이 된다.",
    "프로그래밍을 배우는 것은 흥미롭고 도전적이다.",
    "어제 본 영화가 생각보다 재미있었다.",
    "문제를 해결하기 위해선 다양한 접근 방식을 시도해야 한다.",
    "퇴근 후에는 가족과 함께 저녁을 먹는다.",
    "미래를 위해 지금 할 수 있는 것에 집중해야 한다.",
    "오늘 아침에는 일찍 일어나서 운동을 했다.",
    "저녁에 친구들과 만날 계획을 세웠다.",
    "기술이 발전하면서 우리의 생활이 많이 달라졌다.",
    "주말에는 집에서 쉬는 것을 좋아한다.",
    "내일은 새로운 책을 시작해 볼 생각이다.",
    "날씨가 더 추워지기 전에 겨울 옷을 꺼내야겠다.",
    "최근에 새로운 취미를 찾으려고 노력하고 있다.",
    "커피를 마시면 집중력이 높아진다.",
    "한 달 후에 중요한 발표가 있어서 준비를 시작했다.",
    "친구들과 함께 만든 계획이 잘 진행되고 있다.",
    "매일 조금씩 공부하는 것이 중요하다.",
    "운동 후에 맛있는 음식을 먹는 것이 가장 즐겁다.",
    "나는 책을 읽는 것보다 영화를 보는 것을 더 선호한다.",
    "최근에 업무가 많이 밀려서 바쁘게 지내고 있다.",
    "새로운 기술을 배우는 것은 항상 도전적이다.",
    "가끔은 혼자만의 시간을 가지는 것이 필요하다.",
    "어제 본 드라마가 감동적이었다.",
    "올해 목표는 매일 운동하는 것이다.",
    "이 프로젝트는 내 인생에서 중요한 경험이 될 것이다.",
    "휴일에는 가족과 함께 시간을 보내는 것이 가장 좋다.",
    "오늘은 일찍 잠자리에 들려고 한다.",
    "책을 통해 새로운 지식을 얻는 것이 매우 흥미롭다.",
    "지난주에 다녀온 여행이 정말 기억에 남는다.",
    "사람들과 소통하는 것이 중요한 일이라고 생각한다.",
    "새로운 아이디어를 떠올리는 것은 언제나 즐겁다.",
    "다음 주에는 중요한 시험이 있어서 집중하고 있다.",
    "기술 발전 덕분에 세상이 점점 더 편리해지고 있다.",
    "이번 주말에는 친구들과 함께 등산을 갈 계획이다.",
    "항상 긍정적인 태도를 유지하려고 노력한다.",
    "오늘은 특별한 일이 있어 기분이 좋다.",
];

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000); // seconds를 milliseconds로 변환
  });
}

describe('Rerank 50 Test', () => {
  it('should find relevant sentences', async function() {
    this.timeout(10000);

    const model = await XLMRobertaModel.from_pretrained("jinaai/jina-reranker-v1-tiny-en", {
      device: 'cpu',
    });
    const tokenizer = await AutoTokenizer.from_pretrained("jinaai/jina-reranker-v1-tiny-en");

    await wait(5);  // For test code pass

    const results = await rerank(query, documents, model, tokenizer, { return_documents: true, top_k: 1 });
    expect(results).to.be.an('array');
    expect(results[0].corpus_id).to.be.an('number');
    expect(results[0].score).to.be.an('number');
    expect(results[0].text).to.be.an('string');
    expect(results[0].text).to.equal("노동규는 북한과 소련의 공산당을 지지한다");
  });
});
