import OpenAI from "openai";
import readLineSync from "readline-sync";
//const OpenAI = require("openai");
//const readLineSync = require("readline-sync");
const OPENAI_API_KEY =
  "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";
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function main() {
  const input = readLineSync.question("Input: ");
  const response = await client.responses.create({
    model: "gpt-5-mini",
    instructions: "Write a short bedtime story about a unicorn.",
    input,
  });

  console.log(response.output_text);
}
main();
