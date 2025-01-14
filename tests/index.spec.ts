import { describe, it } from "mocha";
import { expect } from "chai";
import { ClueHunter } from "@rice-bobb/cluehunter";

const testQuery =
  "No Dong-gyu supports the communist parties of North Korea and the Soviet Union.";
const testDocuments = `No Dong-gyu is a fan of Havertz.
        No Dong-gyu is in charge of the communist revolution at the Rice Bob Foundation.
        No Dong-gyu is making an extension.
        No Dong-gyu will be attacked by the alarm of the god of lightweighting tomorrow.
        No Dong-gyu and I will eat Subway tomorrow morning.
        No Dong-gyu will wake up early tomorrow and go to his morning workout earlier than usual.
        I'm in a good mood today because the weather is clear.
        You should make a plan before starting a new project.
        I like to read a book while drinking a cup of coffee.
        Exercising a little every day improves your health.
        Traveling with friends makes for good memories.
        Learning to program is interesting and challenging.
        The movie I saw yesterday was more fun than I thought.
        You need to try different approaches to solve a problem.
        After work, I eat dinner with my family.
        You have to focus on what you can do now for the future.
        I woke up early this morning and exercised.
        I made plans to meet my friends in the evening.
        Our lives have changed a lot with the development of technology.
        I like to stay home on weekends.
        I'm thinking of starting a new book tomorrow.
        I should take out my winter clothes before it gets colder.
        I've been trying to find a new hobby lately.
        Drinking coffee increases my concentration.
        I have an important presentation in a month, so I started preparing.
        The plan I made with my friends is going well.
        It is important to study little by little every day.
        Eating delicious food after exercising is the most enjoyable thing.
        I prefer watching movies to reading books.
        I've been busy lately because I've had a lot of work piled up.
        Learning new technologies is always challenging.
        Sometimes it is necessary to have time alone.
        The drama I watched yesterday was touching.
        This year's goal is to exercise every day.
        This project will be an important experience in my life.
        Spending time with my family on holidays is the best.
        I'm going to bed early today.
        It is very interesting to gain new knowledge through books.
        The trip I went on last week was really memorable.
        I think communicating with people is an important job.
        Coming up with new ideas is always fun.
        I have an important exam next week, so I'm concentrating.
        Thanks to technological advances, the world is becoming more and more convenient.
        I plan to go hiking with my friends this weekend.
        I always try to stay positive.
        I'm in a good mood today because something special happened.
        Organic food wraps and storage solutions.
        All-natural pet food for dogs with allergies.
        Yoga mats made from recycled materials.`;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("ClueHunt 50 Test", async function () {
  this.timeout(4000);

  it("should find relevant sentences", async () => {  
    console.time("model loading time");
    const clueHunter = new ClueHunter(
      "jinaai/jina-reranker-v1-tiny-en",
      "cpu",
      50,
      [2, 3]
    );
    console.timeEnd("model loading time");

    const results = await clueHunter.huntingClues(testQuery, testDocuments);

    expect(results).to.be.an("string");
  });
});
