import { writeFileSync } from 'fs';
import { join } from 'path';
import { FounderWithScore } from '../models/Founder';

export class ReportGenerator {
  generateMarkdown(founders: FounderWithScore[], weekOf: Date): string {
    const dateStr = weekOf.toISOString().split('T')[0];

    let markdown = `# Top ${founders.length} Founders — Week of ${dateStr}\n\n`;
    markdown += `Generated: ${new Date().toISOString()}\n\n`;
    markdown += `---\n\n`;

    founders.forEach((founder, index) => {
      markdown += this.generateFounderSection(founder, index + 1);
      markdown += `\n---\n\n`;
    });

    return markdown;
  }

  generateHTML(founders: FounderWithScore[], weekOf: Date): string {
    const dateStr = weekOf.toISOString().split('T')[0];

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top ${founders.length} Founders - Week of ${dateStr}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .founder-card {
            background: white;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .founder-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .founder-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        .score-badge {
            background: #3498db;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 18px;
        }
        .startup-name {
            color: #7f8c8d;
            font-size: 16px;
            margin-bottom: 8px;
        }
        .metadata {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }
        .metadata-item {
            background: #ecf0f1;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 14px;
        }
        .section {
            margin-bottom: 16px;
        }
        .section-title {
            font-weight: bold;
            color: #34495e;
            margin-bottom: 8px;
        }
        .links {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .link-button {
            background: #3498db;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
        }
        .link-button:hover {
            background: #2980b9;
        }
        .email-template {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 16px;
            margin-top: 16px;
            white-space: pre-wrap;
            font-family: monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <h1>🚀 Top ${founders.length} Founders — Week of ${dateStr}</h1>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
`;

    founders.forEach((founder, index) => {
      html += this.generateFounderHTML(founder, index + 1);
    });

    html += `
</body>
</html>
    `;

    return html;
  }

  generateJSON(founders: FounderWithScore[], weekOf: Date): string {
    const report = {
      week_of: weekOf.toISOString().split('T')[0],
      generated_at: new Date().toISOString(),
      count: founders.length,
      founders: founders.map((f, i) => ({
        rank: i + 1,
        founder_id: f.founder_id,
        name: f.name,
        startup_name: f.startup_name,
        university: f.university,
        location: f.location,
        niche: f.niche,
        total_score: f.score?.total_score,
        scores: f.score,
        urls: f.urls,
        bio: f.ai_bio,
        email_template: f.ai_email_template,
      })),
    };

    return JSON.stringify(report, null, 2);
  }

  saveReports(
    markdown: string,
    html: string,
    json: string,
    weekOf: Date
  ): { markdownPath: string; htmlPath: string; jsonPath: string } {
    const dateStr = weekOf.toISOString().split('T')[0];
    const reportsDir = join(process.cwd(), 'weekly_reports');

    const markdownPath = join(reportsDir, `top10-${dateStr}.md`);
    const htmlPath = join(reportsDir, `top10-${dateStr}.html`);
    const jsonPath = join(reportsDir, `top10-${dateStr}.json`);

    writeFileSync(markdownPath, markdown);
    writeFileSync(htmlPath, html);
    writeFileSync(jsonPath, json);

    console.log(`✓ Reports saved:`);
    console.log(`  - ${markdownPath}`);
    console.log(`  - ${htmlPath}`);
    console.log(`  - ${jsonPath}`);

    return { markdownPath, htmlPath, jsonPath };
  }

  private generateFounderSection(founder: FounderWithScore, rank: number): string {
    let section = `## ${rank}. ${founder.name} — Score: ${founder.score?.total_score || 'N/A'}/100\n\n`;

    section += `**Startup:** ${founder.startup_name || 'N/A'}  \n`;
    section += `**Category/Niche:** ${founder.niche || 'N/A'}  \n`;

    if (founder.university) {
      section += `**University:** ${founder.university}  \n`;
    }

    if (founder.location) {
      section += `**Location:** ${founder.location}  \n`;
    }

    section += `\n### Why This Founder Matters\n\n`;
    section += `${founder.ai_bio || 'No bio available'}\n\n`;

    if (founder.ai_execution_evidence) {
      section += `### Execution Highlights\n\n`;
      section += `${founder.ai_execution_evidence}\n\n`;
    }

    if (founder.ai_technical_summary) {
      section += `### Technical Depth Summary\n\n`;
      section += `${founder.ai_technical_summary}\n\n`;
    }

    if (founder.ai_momentum_signals) {
      section += `### Recent Momentum\n\n`;
      section += `${founder.ai_momentum_signals}\n\n`;
    }

    if (founder.ai_risks) {
      section += `### Key Risks\n\n`;
      section += `${founder.ai_risks}\n\n`;
    }

    if (founder.score) {
      section += `### Score Breakdown\n\n`;
      section += `- **Execution Velocity:** ${founder.score.execution_velocity}/25\n`;
      section += `- **Technical Depth:** ${founder.score.technical_depth}/25\n`;
      section += `- **Momentum:** ${founder.score.momentum_score}/20\n`;
      section += `- **Market Potential:** ${founder.score.market_potential}/20\n`;
      section += `- **Credibility:** ${founder.score.credibility}/10\n\n`;
    }

    if (founder.ai_email_template) {
      section += `### Intro Email Template\n\n`;
      section += '```\n';
      section += `${founder.ai_email_template}\n`;
      section += '```\n\n';
    }

    if (founder.urls && Object.keys(founder.urls).length > 0) {
      section += `### Links\n\n`;
      Object.entries(founder.urls).forEach(([key, url]) => {
        if (url) {
          section += `- **${key}:** ${url}\n`;
        }
      });
      section += '\n';
    }

    return section;
  }

  private generateFounderHTML(founder: FounderWithScore, rank: number): string {
    let html = `
    <div class="founder-card">
        <div class="founder-header">
            <div>
                <div class="founder-name">${rank}. ${founder.name}</div>
                <div class="startup-name">${founder.startup_name || 'N/A'}</div>
            </div>
            <div class="score-badge">${founder.score?.total_score || 'N/A'}/100</div>
        </div>

        <div class="metadata">
            ${founder.niche ? `<span class="metadata-item">📊 ${founder.niche}</span>` : ''}
            ${founder.university ? `<span class="metadata-item">🎓 ${founder.university}</span>` : ''}
            ${founder.location ? `<span class="metadata-item">📍 ${founder.location}</span>` : ''}
        </div>

        ${
          founder.ai_bio
            ? `
        <div class="section">
            <div class="section-title">Why This Founder Matters</div>
            <div>${founder.ai_bio}</div>
        </div>
        `
            : ''
        }

        ${
          founder.ai_execution_evidence
            ? `
        <div class="section">
            <div class="section-title">Execution Highlights</div>
            <div>${founder.ai_execution_evidence}</div>
        </div>
        `
            : ''
        }

        ${
          founder.ai_technical_summary
            ? `
        <div class="section">
            <div class="section-title">Technical Depth</div>
            <div>${founder.ai_technical_summary}</div>
        </div>
        `
            : ''
        }

        ${
          founder.score
            ? `
        <div class="section">
            <div class="section-title">Score Breakdown</div>
            <div>
                • Execution Velocity: ${founder.score.execution_velocity}/25<br>
                • Technical Depth: ${founder.score.technical_depth}/25<br>
                • Momentum: ${founder.score.momentum_score}/20<br>
                • Market Potential: ${founder.score.market_potential}/20<br>
                • Credibility: ${founder.score.credibility}/10
            </div>
        </div>
        `
            : ''
        }

        ${
          founder.urls && Object.keys(founder.urls).length > 0
            ? `
        <div class="section">
            <div class="section-title">Links</div>
            <div class="links">
                ${Object.entries(founder.urls)
                  .map(([key, url]) =>
                    url ? `<a href="${url}" class="link-button" target="_blank">${key}</a>` : ''
                  )
                  .join('')}
            </div>
        </div>
        `
            : ''
        }

        ${
          founder.ai_email_template
            ? `
        <div class="email-template">
            <strong>📧 Intro Email Template:</strong><br><br>
            ${founder.ai_email_template}
        </div>
        `
            : ''
        }
    </div>
    `;

    return html;
  }
}

export const reportGenerator = new ReportGenerator();
