"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const FounderService_1 = require("../src/services/FounderService");
const FilterService_1 = require("../src/services/FilterService");
const ReportGenerator_1 = require("../src/services/ReportGenerator");
const database_1 = __importDefault(require("../src/db/database"));
async function generateWeeklyReport() {
    console.log('Starting weekly report generation...\n');
    try {
        console.log('1. Fetching all founders with scores...');
        const allFounders = await FounderService_1.founderService.getAllFoundersWithScores();
        console.log(`   Found ${allFounders.length} founders\n`);
        console.log('2. Applying filters...');
        const filtered = FilterService_1.filterService.applyFilters(allFounders);
        console.log(`   ${filtered.length} founders after filtering\n`);
        console.log('3. Selecting top 10...');
        const top10 = filtered.slice(0, 10);
        console.log(`   Top ${top10.length} founders selected\n`);
        console.log('4. Generating reports...');
        const weekOf = new Date();
        const markdown = ReportGenerator_1.reportGenerator.generateMarkdown(top10, weekOf);
        const html = ReportGenerator_1.reportGenerator.generateHTML(top10, weekOf);
        const json = ReportGenerator_1.reportGenerator.generateJSON(top10, weekOf);
        console.log('5. Saving reports...');
        const paths = ReportGenerator_1.reportGenerator.saveReports(markdown, html, json, weekOf);
        console.log('\n✓ Weekly report generation complete!\n');
        console.log('Report Summary:');
        console.log(`  - Total Founders: ${allFounders.length}`);
        console.log(`  - After Filtering: ${filtered.length}`);
        console.log(`  - Top Founders: ${top10.length}`);
        console.log('\nReport Files:');
        console.log(`  - Markdown: ${paths.markdownPath}`);
        console.log(`  - HTML: ${paths.htmlPath}`);
        console.log(`  - JSON: ${paths.jsonPath}`);
        if (top10.length > 0) {
            console.log('\nTop 3 Founders:');
            top10.slice(0, 3).forEach((f, i) => {
                console.log(`  ${i + 1}. ${f.name} (${f.startup_name}) - ${f.score?.total_score}/100`);
            });
        }
        await database_1.default.close();
        process.exit(0);
    }
    catch (error) {
        console.error('Error generating weekly report:', error);
        await database_1.default.close();
        process.exit(1);
    }
}
generateWeeklyReport();
//# sourceMappingURL=generate-weekly-report.js.map