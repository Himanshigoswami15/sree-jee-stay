import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

async function main() {
  console.log("Testing OpenRouter SDK streaming...\n");
  const stream = await openrouter.chat.send({
    chatRequest: {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "How many r's are in the word 'strawberry'?"
        }
      ],
      stream: true
    }
  });

  let response = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      response += content;
      process.stdout.write(content);
    }

    if (chunk.usage) {
      console.log("\n\nReasoning tokens:", chunk.usage.completionTokensDetails?.reasoningTokens ?? 0);
    }
  }
}

main().catch((err) => {
  console.error("\nError executing OpenRouter stream:", err);
});
