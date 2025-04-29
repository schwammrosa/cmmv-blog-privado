import { AIContentModule } from "./api/ai-content.module";
export * from "./api/ai-content.module";
export * from "./api/ai-content.service";

export default {
    name: '@cmmv/ai-content',
    version: '0.0.1',
    description: 'AI Content package for CMMV',
    api: AIContentModule,
    dependencies: []
}