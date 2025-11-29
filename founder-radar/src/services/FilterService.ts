import { Founder, FounderWithScore } from '../models/Founder';
import { FilterConfig } from '../models/Config';
import { configManager } from '../utils/config';

export class FilterService {
  private filters: FilterConfig;

  constructor() {
    this.filters = configManager.getFilters();
  }

  applyFilters(founders: FounderWithScore[]): FounderWithScore[] {
    console.log(`Applying filters to ${founders.length} founders...`);

    let filtered = founders;

    if (this.filters.university && this.filters.university.length > 0) {
      filtered = this.filterByUniversity(filtered);
    }

    if (this.filters.age_range) {
      filtered = this.filterByAge(filtered);
    }

    if (this.filters.location && this.filters.location.length > 0) {
      filtered = this.filterByLocation(filtered);
    }

    if (this.filters.product_niche && this.filters.product_niche.length > 0) {
      filtered = this.filterByNiche(filtered);
    }

    if (this.filters.technical_background && this.filters.technical_background.length > 0) {
      filtered = this.filterByTechnicalBackground(filtered);
    }

    if (this.filters.min_execution_score) {
      filtered = this.filterByExecutionScore(filtered);
    }

    if (this.filters.min_technical_score) {
      filtered = this.filterByTechnicalScore(filtered);
    }

    if (this.filters.exclude_non_technical) {
      filtered = this.excludeNonTechnical(filtered);
    }

    console.log(`✓ Filtered down to ${filtered.length} founders`);
    return filtered;
  }

  private filterByUniversity(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.university) return false;
      return this.filters.university!.some((uni) =>
        f.university!.toLowerCase().includes(uni.toLowerCase())
      );
    });
  }

  private filterByAge(founders: FounderWithScore[]): FounderWithScore[] {
    const [minAge, maxAge] = this.filters.age_range!;
    return founders.filter((f) => {
      if (!f.age) return true;
      return f.age >= minAge && f.age <= maxAge;
    });
  }

  private filterByLocation(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.location) return false;
      return this.filters.location!.some((loc) =>
        f.location!.toLowerCase().includes(loc.toLowerCase())
      );
    });
  }

  private filterByNiche(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.niche) return false;
      return this.filters.product_niche!.some((niche) =>
        f.niche!.toLowerCase().includes(niche.toLowerCase())
      );
    });
  }

  private filterByTechnicalBackground(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.ai_technical_summary) return false;
      const summary = f.ai_technical_summary.toLowerCase();
      return this.filters.technical_background!.some((bg) =>
        summary.includes(bg.toLowerCase())
      );
    });
  }

  private filterByExecutionScore(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.score) return false;
      return f.score.execution_velocity >= this.filters.min_execution_score!;
    });
  }

  private filterByTechnicalScore(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.score) return false;
      return f.score.technical_depth >= this.filters.min_technical_score!;
    });
  }

  private excludeNonTechnical(founders: FounderWithScore[]): FounderWithScore[] {
    return founders.filter((f) => {
      if (!f.score) return false;
      return f.score.technical_depth >= 10;
    });
  }

  updateFilters(newFilters: Partial<FilterConfig>): void {
    this.filters = { ...this.filters, ...newFilters };
    configManager.updateFilters(newFilters);
  }
}

export const filterService = new FilterService();
