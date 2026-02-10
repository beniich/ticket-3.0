import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export class MCPClient {
    private client: Anthropic;
    private model: string;

    constructor() {
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.warn('⚠️  Aucune clé API IA trouvée. Le système MCP utilisera un mode dégradé.');
        }

        this.client = new Anthropic({
            apiKey: apiKey || 'sk-dummy-key'
        });
        this.model = process.env.MCP_MODEL || 'claude-3-5-sonnet-20241022';
    }

    async sendMessage(prompt: string, context?: any): Promise<any> {
        try {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: this.buildPromptWithContext(prompt, context)
                    }
                ]
            });

            return {
                text: response.content[0].type === 'text' ? response.content[0].text : '',
                usage: response.usage
            };
        } catch (error) {
            console.error('❌ Erreur MCP client:', error);
            throw error;
        }
    }

    async generateStructuredResponse<T extends z.ZodTypeAny>(
        prompt: string,
        schema: T,
        context?: any
    ): Promise<z.infer<T>> {
        try {
            const response = await this.sendMessage(
                `${prompt}\n\nRépondez UNIQUEMENT avec un objet JSON valide qui respecte ce schéma:\n${JSON.stringify(schema.shape || schema, null, 2)}`,
                context
            );

            // Parser et valider la réponse
            const jsonMatch = response.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Aucun JSON trouvé dans la réponse');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            return schema.parse(parsed);
        } catch (error) {
            console.error('❌ Erreur génération réponse structurée:', error);
            throw error;
        }
    }

    private buildPromptWithContext(prompt: string, context?: any): string {
        if (!context) return prompt;

        return `
Contexte:
${JSON.stringify(context, null, 2)}

${prompt}
    `.trim();
    }

    isConfigured(): boolean {
        return !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
    }
}
