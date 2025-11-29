-- Founder Radar Database Schema

-- Create founders table
CREATE TABLE IF NOT EXISTS founders (
    founder_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    startup_name VARCHAR(255),
    age INTEGER,
    location VARCHAR(255),
    university VARCHAR(255),
    niche VARCHAR(255),
    sources JSONB DEFAULT '[]',
    urls JSONB DEFAULT '{}',
    raw_data JSONB DEFAULT '{}',
    ai_bio TEXT,
    ai_execution_evidence TEXT,
    ai_technical_summary TEXT,
    ai_market_summary TEXT,
    ai_momentum_signals TEXT,
    ai_risks TEXT,
    ai_email_template TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
    score_id SERIAL PRIMARY KEY,
    founder_id INTEGER REFERENCES founders(founder_id) ON DELETE CASCADE,
    execution_velocity DECIMAL(5,2) DEFAULT 0 CHECK (execution_velocity >= 0 AND execution_velocity <= 25),
    technical_depth DECIMAL(5,2) DEFAULT 0 CHECK (technical_depth >= 0 AND technical_depth <= 25),
    momentum_score DECIMAL(5,2) DEFAULT 0 CHECK (momentum_score >= 0 AND momentum_score <= 20),
    market_potential DECIMAL(5,2) DEFAULT 0 CHECK (market_potential >= 0 AND market_potential <= 20),
    credibility DECIMAL(5,2) DEFAULT 0 CHECK (credibility >= 0 AND credibility <= 10),
    custom_score_weights JSONB DEFAULT '{}',
    total_score DECIMAL(6,2) DEFAULT 0,
    score_explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(founder_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_founders_name ON founders(name);
CREATE INDEX IF NOT EXISTS idx_founders_university ON founders(university);
CREATE INDEX IF NOT EXISTS idx_founders_niche ON founders(niche);
CREATE INDEX IF NOT EXISTS idx_scores_total ON scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_founders_created ON founders(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON founders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
