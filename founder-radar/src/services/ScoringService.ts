import { Score } from '../models/Founder';
import { ScoreWeights } from '../models/Config';
import { configManager } from '../utils/config';

export class ScoringService {
  private weights: ScoreWeights;

  constructor() {
    this.weights = configManager.getWeights();
  }

  calculateTotalScore(scores: {
    execution_velocity: number;
    technical_depth: number;
    momentum_score: number;
    market_potential: number;
    credibility: number;
  }): number {
    const total =
      scores.execution_velocity * this.weights.execution_velocity +
      scores.technical_depth * this.weights.technical_depth +
      scores.momentum_score * this.weights.momentum_score +
      scores.market_potential * this.weights.market_potential +
      scores.credibility * this.weights.credibility;

    return Math.round(total * 100) / 100;
  }

  validateScore(score: Score): boolean {
    if (score.execution_velocity < 0 || score.execution_velocity > 25) return false;
    if (score.technical_depth < 0 || score.technical_depth > 25) return false;
    if (score.momentum_score < 0 || score.momentum_score > 20) return false;
    if (score.market_potential < 0 || score.market_potential > 20) return false;
    if (score.credibility < 0 || score.credibility > 10) return false;

    return true;
  }

  updateWeights(newWeights: Partial<ScoreWeights>): void {
    this.weights = { ...this.weights, ...newWeights };

    const sum = Object.values(this.weights).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 0.001) {
      console.warn(`Warning: Weights sum to ${sum}, not 1.0. Normalizing...`);
      const entries = Object.entries(this.weights).map(([k, v]) => [k, v / sum]);
      const normalized: ScoreWeights = {
        execution_velocity: 0,
        technical_depth: 0,
        momentum_score: 0,
        market_potential: 0,
        credibility: 0,
      };
      for (const [key, value] of entries) {
        if (key in normalized) {
          (normalized as any)[key] = value;
        }
      }
      this.weights = normalized;
    }

    configManager.updateWeights(this.weights);
  }

  getWeights(): ScoreWeights {
    return { ...this.weights };
  }

  getMaxScore(): number {
    return 100;
  }

  getScoreBreakdown(score: Score): string {
    const weighted = {
      execution: score.execution_velocity * this.weights.execution_velocity,
      technical: score.technical_depth * this.weights.technical_depth,
      momentum: score.momentum_score * this.weights.momentum_score,
      market: score.market_potential * this.weights.market_potential,
      credibility: score.credibility * this.weights.credibility,
    };

    return `
Score Breakdown:
  Execution Velocity: ${score.execution_velocity}/25 (weighted: ${weighted.execution.toFixed(2)})
  Technical Depth: ${score.technical_depth}/25 (weighted: ${weighted.technical.toFixed(2)})
  Momentum: ${score.momentum_score}/20 (weighted: ${weighted.momentum.toFixed(2)})
  Market Potential: ${score.market_potential}/20 (weighted: ${weighted.market.toFixed(2)})
  Credibility: ${score.credibility}/10 (weighted: ${weighted.credibility.toFixed(2)})

  Total: ${score.total_score}/100
    `.trim();
  }
}

export const scoringService = new ScoringService();
