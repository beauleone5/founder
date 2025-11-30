import asyncio
from sqlalchemy import select
from app.db.base import async_session_maker, init_db
from app.models.company import Company


AI_COMPANIES = [
    {
        "name": "Anthropic",
        "sector": "AI Research & Safety",
        "website": "https://anthropic.com",
        "logo": "https://logo.clearbit.com/anthropic.com",
        "description": "AI safety and research company building reliable, interpretable, and steerable AI systems",
        "competitor_list": ["OpenAI", "Google DeepMind", "Cohere", "Inflection AI"]
    },
    {
        "name": "OpenAI",
        "sector": "AI Research",
        "website": "https://openai.com",
        "logo": "https://logo.clearbit.com/openai.com",
        "description": "Leading AI research lab creating advanced AI systems and models",
        "competitor_list": ["Anthropic", "Google DeepMind", "Cohere", "Mistral"]
    },
    {
        "name": "Cohere",
        "sector": "Enterprise AI",
        "website": "https://cohere.com",
        "logo": "https://logo.clearbit.com/cohere.com",
        "description": "Enterprise AI platform providing language models for business applications",
        "competitor_list": ["OpenAI", "Anthropic", "AI21 Labs", "Hugging Face"]
    },
    {
        "name": "Perplexity",
        "sector": "AI Search",
        "website": "https://perplexity.ai",
        "logo": "https://logo.clearbit.com/perplexity.ai",
        "description": "AI-powered search and discovery platform",
        "competitor_list": ["Google", "Bing", "You.com", "Neeva"]
    },
    {
        "name": "ElevenLabs",
        "sector": "AI Voice",
        "website": "https://elevenlabs.io",
        "logo": "https://logo.clearbit.com/elevenlabs.io",
        "description": "AI voice synthesis and text-to-speech technology",
        "competitor_list": ["Descript", "Resemble AI", "Play.ht", "Murf AI"]
    },
    {
        "name": "Runway",
        "sector": "AI Video",
        "website": "https://runwayml.com",
        "logo": "https://logo.clearbit.com/runwayml.com",
        "description": "AI-powered creative tools for video generation and editing",
        "competitor_list": ["Pika", "Synthesia", "D-ID", "Hour One"]
    },
    {
        "name": "Character.ai",
        "sector": "AI Chat",
        "website": "https://character.ai",
        "logo": "https://logo.clearbit.com/character.ai",
        "description": "Platform for creating and interacting with AI characters",
        "competitor_list": ["Replika", "Chai", "Inworld AI", "Inflection AI"]
    },
    {
        "name": "Mistral",
        "sector": "Open AI Models",
        "website": "https://mistral.ai",
        "logo": "https://logo.clearbit.com/mistral.ai",
        "description": "European AI company building open and efficient language models",
        "competitor_list": ["OpenAI", "Anthropic", "Meta AI", "Hugging Face"]
    },
    {
        "name": "Adept",
        "sector": "AI Agents",
        "website": "https://adept.ai",
        "logo": "https://logo.clearbit.com/adept.ai",
        "description": "Building AI teammates that can use software tools",
        "competitor_list": ["OpenAI", "Anthropic", "Google DeepMind", "Inflection AI"]
    },
    {
        "name": "Deepgram",
        "sector": "Speech AI",
        "website": "https://deepgram.com",
        "logo": "https://logo.clearbit.com/deepgram.com",
        "description": "Speech recognition and voice AI API platform",
        "competitor_list": ["AssemblyAI", "Rev AI", "AWS Transcribe", "Google Speech-to-Text"]
    },
    {
        "name": "Hugging Face",
        "sector": "AI Platform",
        "website": "https://huggingface.co",
        "logo": "https://logo.clearbit.com/huggingface.co",
        "description": "Open-source AI platform and model hub",
        "competitor_list": ["GitHub", "Replicate", "Modal", "Together AI"]
    },
    {
        "name": "Inflection AI",
        "sector": "Personal AI",
        "website": "https://inflection.ai",
        "logo": "https://logo.clearbit.com/inflection.ai",
        "description": "Building personal AI assistants",
        "competitor_list": ["Anthropic", "OpenAI", "Character.ai", "Replika"]
    },
    {
        "name": "Stability AI",
        "sector": "Generative AI",
        "website": "https://stability.ai",
        "logo": "https://logo.clearbit.com/stability.ai",
        "description": "Open-source generative AI models including Stable Diffusion",
        "competitor_list": ["Midjourney", "DALL-E", "Adobe Firefly", "Leonardo AI"]
    },
    {
        "name": "Midjourney",
        "sector": "AI Art",
        "website": "https://midjourney.com",
        "logo": "https://logo.clearbit.com/midjourney.com",
        "description": "AI image generation platform",
        "competitor_list": ["Stability AI", "DALL-E", "Adobe Firefly", "Leonardo AI"]
    },
    {
        "name": "Scale AI",
        "sector": "AI Data",
        "website": "https://scale.com",
        "logo": "https://logo.clearbit.com/scale.com",
        "description": "Data platform for AI training and validation",
        "competitor_list": ["Labelbox", "Snorkel AI", "Datasaur", "V7"]
    },
    {
        "name": "AI21 Labs",
        "sector": "Language AI",
        "website": "https://ai21.com",
        "logo": "https://logo.clearbit.com/ai21.com",
        "description": "Advanced language models and AI writing tools",
        "competitor_list": ["OpenAI", "Cohere", "Anthropic", "Writer"]
    },
    {
        "name": "Jasper",
        "sector": "AI Marketing",
        "website": "https://jasper.ai",
        "logo": "https://logo.clearbit.com/jasper.ai",
        "description": "AI content creation platform for marketing",
        "competitor_list": ["Copy.ai", "Writer", "Writesonic", "Rytr"]
    },
    {
        "name": "Copy.ai",
        "sector": "AI Copywriting",
        "website": "https://copy.ai",
        "logo": "https://logo.clearbit.com/copy.ai",
        "description": "AI-powered copywriting and content generation",
        "competitor_list": ["Jasper", "Writesonic", "Rytr", "Writer"]
    },
    {
        "name": "Synthesia",
        "sector": "AI Video",
        "website": "https://synthesia.io",
        "logo": "https://logo.clearbit.com/synthesia.io",
        "description": "AI video generation with digital avatars",
        "competitor_list": ["D-ID", "Hour One", "Runway", "Elai"]
    },
    {
        "name": "Replicate",
        "sector": "AI Infrastructure",
        "website": "https://replicate.com",
        "logo": "https://logo.clearbit.com/replicate.com",
        "description": "Platform for running AI models in the cloud",
        "competitor_list": ["Hugging Face", "Together AI", "Modal", "Banana"]
    },
    {
        "name": "Together AI",
        "sector": "AI Infrastructure",
        "website": "https://together.ai",
        "logo": "https://logo.clearbit.com/together.ai",
        "description": "Decentralized AI infrastructure and models",
        "competitor_list": ["Replicate", "Modal", "Hugging Face", "RunPod"]
    },
    {
        "name": "Pinecone",
        "sector": "Vector Database",
        "website": "https://pinecone.io",
        "logo": "https://logo.clearbit.com/pinecone.io",
        "description": "Vector database for AI applications",
        "competitor_list": ["Weaviate", "Milvus", "Qdrant", "Chroma"]
    },
    {
        "name": "LangChain",
        "sector": "AI Development",
        "website": "https://langchain.com",
        "logo": "https://logo.clearbit.com/langchain.com",
        "description": "Framework for developing LLM applications",
        "competitor_list": ["LlamaIndex", "Haystack", "Semantic Kernel", "AutoGPT"]
    },
    {
        "name": "Weights & Biases",
        "sector": "ML Ops",
        "website": "https://wandb.ai",
        "logo": "https://logo.clearbit.com/wandb.ai",
        "description": "ML experiment tracking and model management",
        "competitor_list": ["MLflow", "Neptune.ai", "Comet", "ClearML"]
    },
    {
        "name": "Databricks",
        "sector": "Data & AI",
        "website": "https://databricks.com",
        "logo": "https://logo.clearbit.com/databricks.com",
        "description": "Unified analytics and AI platform",
        "competitor_list": ["Snowflake", "Google BigQuery", "AWS SageMaker", "Azure ML"]
    },
    {
        "name": "Rephrase.ai",
        "sector": "AI Video",
        "website": "https://rephrase.ai",
        "logo": "https://logo.clearbit.com/rephrase.ai",
        "description": "AI-powered video creation with digital avatars",
        "competitor_list": ["Synthesia", "D-ID", "Hour One", "Elai"]
    },
    {
        "name": "Otter.ai",
        "sector": "AI Transcription",
        "website": "https://otter.ai",
        "logo": "https://logo.clearbit.com/otter.ai",
        "description": "AI meeting transcription and notes",
        "competitor_list": ["Fireflies.ai", "Fathom", "Grain", "tl;dv"]
    },
    {
        "name": "Grammarly",
        "sector": "AI Writing",
        "website": "https://grammarly.com",
        "logo": "https://logo.clearbit.com/grammarly.com",
        "description": "AI-powered writing assistant",
        "competitor_list": ["ProWritingAid", "QuillBot", "Writer", "Wordtune"]
    },
    {
        "name": "Notion AI",
        "sector": "Productivity AI",
        "website": "https://notion.so",
        "logo": "https://logo.clearbit.com/notion.so",
        "description": "AI-enhanced workspace and productivity",
        "competitor_list": ["Coda", "Confluence", "ClickUp", "Monday.com"]
    },
    {
        "name": "Harvey",
        "sector": "Legal AI",
        "website": "https://harvey.ai",
        "logo": "https://logo.clearbit.com/harvey.ai",
        "description": "AI assistant for legal professionals",
        "competitor_list": ["Casetext", "Lexion", "Spellbook", "LawGeex"]
    },
    {
        "name": "Glean",
        "sector": "Enterprise Search",
        "website": "https://glean.com",
        "logo": "https://logo.clearbit.com/glean.com",
        "description": "AI-powered enterprise search",
        "competitor_list": ["Hebbia", "Coveo", "Sinequa", "Algolia"]
    },
    {
        "name": "Moveworks",
        "sector": "IT Automation",
        "website": "https://moveworks.com",
        "logo": "https://logo.clearbit.com/moveworks.com",
        "description": "AI platform for IT support automation",
        "competitor_list": ["ServiceNow", "Zendesk", "Freshservice", "Espressive"]
    },
    {
        "name": "Shield AI",
        "sector": "Defense AI",
        "website": "https://shield.ai",
        "logo": "https://logo.clearbit.com/shield.ai",
        "description": "AI pilot systems for defense and aerospace",
        "competitor_list": ["Anduril", "Palantir", "SparkCognition", "C3 AI"]
    },
    {
        "name": "Labelbox",
        "sector": "Data Labeling",
        "website": "https://labelbox.com",
        "logo": "https://logo.clearbit.com/labelbox.com",
        "description": "Training data platform for AI",
        "competitor_list": ["Scale AI", "Snorkel AI", "V7", "Datasaur"]
    },
    {
        "name": "AssemblyAI",
        "sector": "Speech AI",
        "website": "https://assemblyai.com",
        "logo": "https://logo.clearbit.com/assemblyai.com",
        "description": "Speech-to-text API and audio intelligence",
        "competitor_list": ["Deepgram", "Rev AI", "Google Speech-to-Text", "AWS Transcribe"]
    },
    {
        "name": "Descript",
        "sector": "Audio/Video AI",
        "website": "https://descript.com",
        "logo": "https://logo.clearbit.com/descript.com",
        "description": "AI-powered audio and video editing",
        "competitor_list": ["Adobe Premiere", "Final Cut Pro", "Camtasia", "ScreenFlow"]
    },
    {
        "name": "Luma AI",
        "sector": "3D AI",
        "website": "https://lumalabs.ai",
        "logo": "https://logo.clearbit.com/lumalabs.ai",
        "description": "AI for 3D capture and generation",
        "competitor_list": ["Polycam", "Matterport", "3D Scanner App", "NeRF Studio"]
    },
    {
        "name": "Pika",
        "sector": "AI Video",
        "website": "https://pika.art",
        "logo": "https://logo.clearbit.com/pika.art",
        "description": "AI video generation platform",
        "competitor_list": ["Runway", "Synthesia", "D-ID", "Kaiber"]
    },
    {
        "name": "Writer",
        "sector": "Enterprise AI Writing",
        "website": "https://writer.com",
        "logo": "https://logo.clearbit.com/writer.com",
        "description": "AI writing platform for enterprises",
        "competitor_list": ["Jasper", "Copy.ai", "Grammarly", "Wordtune"]
    },
    {
        "name": "Typeface",
        "sector": "Content Generation",
        "website": "https://typeface.ai",
        "logo": "https://logo.clearbit.com/typeface.ai",
        "description": "Generative AI for enterprise content",
        "competitor_list": ["Jasper", "Writer", "Copy.ai", "Anyword"]
    },
    {
        "name": "Hebbia",
        "sector": "AI Search",
        "website": "https://hebbia.ai",
        "logo": "https://logo.clearbit.com/hebbia.ai",
        "description": "AI-powered knowledge search",
        "competitor_list": ["Glean", "Coveo", "Sinequa", "Algolia"]
    },
    {
        "name": "Contextual AI",
        "sector": "Enterprise AI",
        "website": "https://contextual.ai",
        "logo": "https://logo.clearbit.com/contextual.ai",
        "description": "Enterprise AI platform for knowledge work",
        "competitor_list": ["Cohere", "AI21 Labs", "Anthropic", "OpenAI"]
    },
    {
        "name": "Inworld AI",
        "sector": "Gaming AI",
        "website": "https://inworld.ai",
        "logo": "https://logo.clearbit.com/inworld.ai",
        "description": "AI characters for games and virtual worlds",
        "competitor_list": ["Character.ai", "Convai", "Charisma.ai", "Replica Studios"]
    },
    {
        "name": "Leonardo AI",
        "sector": "AI Art",
        "website": "https://leonardo.ai",
        "logo": "https://logo.clearbit.com/leonardo.ai",
        "description": "AI image generation for creative projects",
        "competitor_list": ["Midjourney", "Stability AI", "DALL-E", "Adobe Firefly"]
    },
    {
        "name": "Speak",
        "sector": "Language Learning AI",
        "website": "https://speak.com",
        "logo": "https://logo.clearbit.com/speak.com",
        "description": "AI-powered language learning",
        "competitor_list": ["Duolingo", "Babbel", "Rosetta Stone", "Memrise"]
    },
    {
        "name": "Magic",
        "sector": "AI Coding",
        "website": "https://magic.dev",
        "logo": "https://logo.clearbit.com/magic.dev",
        "description": "AI software engineer",
        "competitor_list": ["GitHub Copilot", "Tabnine", "Cursor", "Replit"]
    },
    {
        "name": "You.com",
        "sector": "AI Search",
        "website": "https://you.com",
        "logo": "https://logo.clearbit.com/you.com",
        "description": "AI-powered search engine",
        "competitor_list": ["Perplexity", "Google", "Bing", "Neeva"]
    },
    {
        "name": "Replit",
        "sector": "AI Development",
        "website": "https://replit.com",
        "logo": "https://logo.clearbit.com/replit.com",
        "description": "AI-powered coding platform",
        "competitor_list": ["GitHub Codespaces", "GitPod", "CodeSandbox", "StackBlitz"]
    },
    {
        "name": "Mem",
        "sector": "AI Note-taking",
        "website": "https://mem.ai",
        "logo": "https://logo.clearbit.com/mem.ai",
        "description": "AI-powered personal knowledge management",
        "competitor_list": ["Notion", "Obsidian", "Roam Research", "Reflect"]
    },
    {
        "name": "Tome",
        "sector": "AI Presentations",
        "website": "https://tome.app",
        "logo": "https://logo.clearbit.com/tome.app",
        "description": "AI-powered storytelling and presentations",
        "competitor_list": ["Gamma", "Beautiful.ai", "Pitch", "Canva"]
    }
]


async def seed_companies():
    """Seed the database with AI companies."""
    print("Initializing database...")
    await init_db()

    async with async_session_maker() as db:
        # Check if companies already exist
        result = await db.execute(select(Company))
        existing_companies = result.scalars().all()

        if existing_companies:
            print(f"Database already has {len(existing_companies)} companies. Skipping seed.")
            return

        print(f"Seeding {len(AI_COMPANIES)} AI companies...")

        for company_data in AI_COMPANIES:
            company = Company(**company_data)
            db.add(company)

        await db.commit()
        print(f"✓ Successfully seeded {len(AI_COMPANIES)} companies")


async def main():
    """Main function to run the seed script."""
    await seed_companies()


if __name__ == "__main__":
    asyncio.run(main())
