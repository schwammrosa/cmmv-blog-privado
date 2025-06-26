import { Service, Config } from "@cmmv/core";
import { GeminiService } from "./gemini/gemini.service";
import { ChatGPTService } from "./chatgpt/chatgpt.service";
import { DeepSeekService } from "./deepseek/deepseek.service";
import { GrokService } from "./grok/grok.service";
import { GroqService } from "./groq/groq.service";

@Service()
export class AIContentService {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly chatgptService: ChatGPTService,
        private readonly grokService: GrokService,
        private readonly groqService: GroqService,
        private readonly deepseekService: DeepSeekService
    ) {}

    async generateContent(prompt: string) {
        const aiService = Config.get("blog.aiService", "gemini");

        switch(aiService) {
            case "gemini":
                return this.geminiService.generateContent(prompt);
            case "chatgpt":
                return this.chatgptService.generateContent(prompt);
            case "grok":
                return this.grokService.generateContent(prompt);
            case "groq":
                return this.groqService.generateContent(prompt);
            case "deepseek":
                return this.deepseekService.generateContent(prompt);
        }
    }
}
