import Anthropic from '@anthropic-ai/sdk';
import { Founder } from '../models/Founder';
import dotenv from 'dotenv';

dotenv.config();

interface EnrichmentResult {
  bio: string;
  execution_evidence: string;
  technical_summary: string;
  market_summary: string;
  momentum_signals: string;
  risks: string;
  email_template: string;
  execution_score: number;
  technical_score: number;
  momentum_score: number;
  market_score: number;
  credibility_score: number;
  score_explanation: string;
}

export class AIEnrichmentService {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }
    this.client = new Anthropic({ apiKey });
  }

  async enrichFounder(founder: Founder): Promise<EnrichmentResult> {
    console.log(`Enriching founder: ${founder.name}`);

    const founderContext = this.buildFounderContext(founder);

    const [
      bio,
      executionResult,
      technicalResult,
      momentum,
      market,
      risks,
      email,
      scoreJustification,
    ] = await Promise.all([
      this.generateBio(founderContext),
      this.scoreExecutionVelocity(founderContext),
      this.scoreTechnicalDepth(founderContext),
      this.analyzeMomentum(founderContext),
      this.scoreMarketPotential(founderContext),
      this.analyzeRisks(founderContext),
      this.generateEmailTemplate(founderContext),
      this.generateScoreJustification(founderContext),
    ]);

    return {
      bio,
      execution_evidence: executionResult.evidence,
      technical_summary: technicalResult.summary,
      market_summary: market.summary,
      momentum_signals: momentum,
      risks,
      email_template: email,
      execution_score: executionResult.score,
      technical_score: technicalResult.score,
      momentum_score: market.momentum_score,
      market_score: market.market_score,
      credibility_score: this.calculateCredibility(founder),
      score_explanation: scoreJustification,
    };
  }

  private buildFounderContext(founder: Founder): string {
    return `
Founder Name: ${founder.name}
Startup/Project: ${founder.startup_name || 'Unknown'}
Location: ${founder.location || 'Unknown'}
University: ${founder.university || 'Unknown'}
Niche/Category: ${founder.niche || 'Unknown'}
Sources Found: ${founder.sources?.join(', ') || 'Unknown'}
URLs: ${JSON.stringify(founder.urls, null, 2)}
Raw Data: ${JSON.stringify(founder.raw_data, null, 2)}
    `.trim();
  }

  private async callClaude(prompt: string): Promise<string> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      return content.type === 'text' ? content.text : '';
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  private async generateBio(context: string): Promise<string> {
    const prompt = `${context}

Summarize this founder's background, technical skills, past roles, and current startup/project in 2-3 concise paragraphs. Focus on execution and technical capabilities.`;

    return await this.callClaude(prompt);
  }

  private async scoreExecutionVelocity(
    context: string
  ): Promise<{ score: number; evidence: string }> {
    const prompt = `${context}

Rate this founder's execution velocity on a scale of 0-25 based on:
- Speed of shipping (commits, releases, product launches)
- Public launches (ProductHunt, HackerNews, etc.)
- Growth signals (hiring, funding, traction)
- Momentum in the last 90 days

Provide:
1. A score from 0-25
2. Evidence/justification for the score

Format:
SCORE: [number]
EVIDENCE: [your analysis]`;

    const response = await this.callClaude(prompt);
    return this.parseScoreResponse(response, 25);
  }

  private async scoreTechnicalDepth(
    context: string
  ): Promise<{ score: number; summary: string }> {
    const prompt = `${context}

Rate this founder's technical depth on a scale of 0-25 based on:
- GitHub contributions and code quality
- Educational background (CS, Engineering, etc.)
- Work history and technical roles
- Domain expertise

Provide:
1. A score from 0-25
2. Summary of technical capabilities

Format:
SCORE: [number]
SUMMARY: [your analysis]`;

    const response = await this.callClaude(prompt);
    const parsed = this.parseScoreResponse(response, 25);
    return {
      score: parsed.score,
      summary: parsed.evidence,
    };
  }

  private async analyzeMomentum(context: string): Promise<string> {
    const prompt = `${context}

List the top momentum signals for this founder in the last 90 days:
- Product launches
- GitHub activity spikes
- Public announcements
- Community engagement
- Press mentions

Be specific and date-aware where possible.`;

    return await this.callClaude(prompt);
  }

  private async scoreMarketPotential(
    context: string
  ): Promise<{ market_score: number; momentum_score: number; summary: string }> {
    const prompt = `${context}

Evaluate this startup's market potential:
1. Market Score (0-20): Based on TAM, urgency, and problem severity
2. Momentum Score (0-20): Based on current traction and growth signals

Provide:
MARKET_SCORE: [number]
MOMENTUM_SCORE: [number]
SUMMARY: [your analysis]`;

    const response = await this.callClaude(prompt);

    const marketMatch = response.match(/MARKET[_ ]SCORE:\s*(\d+(?:\.\d+)?)/i);
    const momentumMatch = response.match(/MOMENTUM[_ ]SCORE:\s*(\d+(?:\.\d+)?)/i);
    const summaryMatch = response.match(/SUMMARY:\s*(.+)/is);

    return {
      market_score: marketMatch ? Math.min(parseFloat(marketMatch[1]), 20) : 10,
      momentum_score: momentumMatch ? Math.min(parseFloat(momentumMatch[1]), 20) : 10,
      summary: summaryMatch ? summaryMatch[1].trim() : response,
    };
  }

  private async analyzeRisks(context: string): Promise<string> {
    const prompt = `${context}

Identify the top 3 risks for this founder/startup:
- Founder risks (experience gaps, solo founder, etc.)
- Market risks (competition, timing, etc.)
- Execution risks (technical complexity, resource constraints, etc.)

Be honest and specific.`;

    return await this.callClaude(prompt);
  }

  private async generateEmailTemplate(context: string): Promise<string> {
    const prompt = `${context}

Write a personalized outreach email from a VC partner to this founder. The email should:
- Be warm and personal
- Show you've done research
- Highlight why you're interested
- Suggest a casual meeting
- Be 3-4 paragraphs max

Do not include subject line or sender details, just the email body.`;

    return await this.callClaude(prompt);
  }

  private async generateScoreJustification(context: string): Promise<string> {
    const prompt = `${context}

Provide a 2-paragraph explanation of why this founder would receive their overall score, covering:
- Execution strengths/weaknesses
- Technical capabilities
- Market opportunity
- Overall investment potential

Be balanced and specific.`;

    return await this.callClaude(prompt);
  }

  private parseScoreResponse(
    response: string,
    maxScore: number
  ): { score: number; evidence: string } {
    const scoreMatch = response.match(/SCORE:\s*(\d+(?:\.\d+)?)/i);
    const evidenceMatch = response.match(/(?:EVIDENCE|SUMMARY):\s*(.+)/is);

    let score = scoreMatch ? parseFloat(scoreMatch[1]) : maxScore / 2;
    score = Math.min(Math.max(score, 0), maxScore);

    const evidence = evidenceMatch ? evidenceMatch[1].trim() : response;

    return { score, evidence };
  }

  private calculateCredibility(founder: Founder): number {
    let credibility = 0;

    if (founder.university) credibility += 3;
    if (founder.sources && founder.sources.length > 1) credibility += 3;
    if (founder.urls?.github) credibility += 2;
    if (founder.urls?.linkedin) credibility += 2;

    return Math.min(credibility, 10);
  }
}

export const aiEnrichmentService = new AIEnrichmentService();
