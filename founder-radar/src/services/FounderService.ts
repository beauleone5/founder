import db from '../db/database';
import { Founder, Score, FounderWithScore } from '../models/Founder';
import { aiEnrichmentService } from './AIEnrichmentService';
import { scoringService } from './ScoringService';

export class FounderService {
  async createFounder(founder: Founder): Promise<Founder> {
    const query = `
      INSERT INTO founders (
        name, startup_name, age, location, university, niche,
        sources, urls, raw_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      founder.name,
      founder.startup_name,
      founder.age,
      founder.location,
      founder.university,
      founder.niche,
      JSON.stringify(founder.sources || []),
      JSON.stringify(founder.urls || {}),
      JSON.stringify(founder.raw_data || {}),
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async enrichAndScoreFounder(founderId: number): Promise<void> {
    const founder = await this.getFounderById(founderId);
    if (!founder) {
      throw new Error(`Founder not found: ${founderId}`);
    }

    console.log(`Enriching founder ${founderId}: ${founder.name}`);

    const enrichment = await aiEnrichmentService.enrichFounder(founder);

    await this.updateFounderEnrichment(founderId, {
      ai_bio: enrichment.bio,
      ai_execution_evidence: enrichment.execution_evidence,
      ai_technical_summary: enrichment.technical_summary,
      ai_market_summary: enrichment.market_summary,
      ai_momentum_signals: enrichment.momentum_signals,
      ai_risks: enrichment.risks,
      ai_email_template: enrichment.email_template,
    });

    const totalScore = scoringService.calculateTotalScore({
      execution_velocity: enrichment.execution_score,
      technical_depth: enrichment.technical_score,
      momentum_score: enrichment.momentum_score,
      market_potential: enrichment.market_score,
      credibility: enrichment.credibility_score,
    });

    await this.createOrUpdateScore(founderId, {
      founder_id: founderId,
      execution_velocity: enrichment.execution_score,
      technical_depth: enrichment.technical_score,
      momentum_score: enrichment.momentum_score,
      market_potential: enrichment.market_score,
      credibility: enrichment.credibility_score,
      total_score: totalScore,
      score_explanation: enrichment.score_explanation,
    });

    console.log(`✓ Enriched and scored founder ${founderId}`);
  }

  async getFounderById(id: number): Promise<Founder | null> {
    const result = await db.query('SELECT * FROM founders WHERE founder_id = $1', [id]);
    return result.rows[0] || null;
  }

  async getFounderWithScore(id: number): Promise<FounderWithScore | null> {
    const query = `
      SELECT f.*,
             s.execution_velocity, s.technical_depth, s.momentum_score,
             s.market_potential, s.credibility, s.total_score, s.score_explanation
      FROM founders f
      LEFT JOIN scores s ON f.founder_id = s.founder_id
      WHERE f.founder_id = $1
    `;

    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return this.mapRowToFounderWithScore(row);
  }

  async getAllFoundersWithScores(): Promise<FounderWithScore[]> {
    const query = `
      SELECT f.*,
             s.execution_velocity, s.technical_depth, s.momentum_score,
             s.market_potential, s.credibility, s.total_score, s.score_explanation
      FROM founders f
      LEFT JOIN scores s ON f.founder_id = s.founder_id
      ORDER BY s.total_score DESC NULLS LAST
    `;

    const result = await db.query(query);
    return result.rows.map((row) => this.mapRowToFounderWithScore(row));
  }

  async getTopFounders(limit: number = 10): Promise<FounderWithScore[]> {
    const query = `
      SELECT f.*,
             s.execution_velocity, s.technical_depth, s.momentum_score,
             s.market_potential, s.credibility, s.total_score, s.score_explanation
      FROM founders f
      INNER JOIN scores s ON f.founder_id = s.founder_id
      ORDER BY s.total_score DESC
      LIMIT $1
    `;

    const result = await db.query(query, [limit]);
    return result.rows.map((row) => this.mapRowToFounderWithScore(row));
  }

  private async updateFounderEnrichment(
    founderId: number,
    enrichment: {
      ai_bio: string;
      ai_execution_evidence: string;
      ai_technical_summary: string;
      ai_market_summary: string;
      ai_momentum_signals: string;
      ai_risks: string;
      ai_email_template: string;
    }
  ): Promise<void> {
    const query = `
      UPDATE founders
      SET ai_bio = $1,
          ai_execution_evidence = $2,
          ai_technical_summary = $3,
          ai_market_summary = $4,
          ai_momentum_signals = $5,
          ai_risks = $6,
          ai_email_template = $7
      WHERE founder_id = $8
    `;

    await db.query(query, [
      enrichment.ai_bio,
      enrichment.ai_execution_evidence,
      enrichment.ai_technical_summary,
      enrichment.ai_market_summary,
      enrichment.ai_momentum_signals,
      enrichment.ai_risks,
      enrichment.ai_email_template,
      founderId,
    ]);
  }

  private async createOrUpdateScore(founderId: number, score: Score): Promise<void> {
    const query = `
      INSERT INTO scores (
        founder_id, execution_velocity, technical_depth, momentum_score,
        market_potential, credibility, total_score, score_explanation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (founder_id) DO UPDATE SET
        execution_velocity = EXCLUDED.execution_velocity,
        technical_depth = EXCLUDED.technical_depth,
        momentum_score = EXCLUDED.momentum_score,
        market_potential = EXCLUDED.market_potential,
        credibility = EXCLUDED.credibility,
        total_score = EXCLUDED.total_score,
        score_explanation = EXCLUDED.score_explanation
    `;

    await db.query(query, [
      founderId,
      score.execution_velocity,
      score.technical_depth,
      score.momentum_score,
      score.market_potential,
      score.credibility,
      score.total_score,
      score.score_explanation,
    ]);
  }

  private mapRowToFounderWithScore(row: any): FounderWithScore {
    const founder: FounderWithScore = {
      founder_id: row.founder_id,
      name: row.name,
      startup_name: row.startup_name,
      age: row.age,
      location: row.location,
      university: row.university,
      niche: row.niche,
      sources: row.sources,
      urls: row.urls,
      raw_data: row.raw_data,
      ai_bio: row.ai_bio,
      ai_execution_evidence: row.ai_execution_evidence,
      ai_technical_summary: row.ai_technical_summary,
      ai_market_summary: row.ai_market_summary,
      ai_momentum_signals: row.ai_momentum_signals,
      ai_risks: row.ai_risks,
      ai_email_template: row.ai_email_template,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    if (row.total_score !== null) {
      founder.score = {
        founder_id: row.founder_id,
        execution_velocity: row.execution_velocity,
        technical_depth: row.technical_depth,
        momentum_score: row.momentum_score,
        market_potential: row.market_potential,
        credibility: row.credibility,
        total_score: row.total_score,
        score_explanation: row.score_explanation,
      };
    }

    return founder;
  }
}

export const founderService = new FounderService();
