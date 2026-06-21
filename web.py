from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import HTMLResponse

app = FastAPI()

# ---------- Serve Frontend ----------
@app.get("/", response_class=HTMLResponse)
def home():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

# ---------- Request Model ----------
class Request(BaseModel):
    topic: str

# ---------- AI Logic ----------
def generate_idea(topic: str):
    return {
        "startup_idea": f"AI-powered platform for {topic}",

        "problem": (
            f"Users struggle with real-world understanding and practical application of {topic}."
        ),

        "solution": (
            f"An AI mentor that teaches {topic} through guided learning, projects, and real-world simulations."
        ),

        "pitch": {
            "one_liner": f"The Uber for learning {topic} using AI-guided hands-on projects.",

            "problem_statement": (
                f"Millions of learners lack structured, practical exposure to {topic}, "
                "leading to poor job readiness."
            ),

            "solution_statement": (
                f"We build an AI-powered mentor that turns {topic} into interactive, project-based learning."
            ),

            "market": "Education technology + AI learning tools (multi-billion dollar market)",

            "business_model": "Freemium + premium learning paths + institutional licensing",

            "why_now": "AI adoption in education is accelerating rapidly",

            "mvp": [
                "AI chat tutor",
                "Project-based learning system",
                "Personalized roadmap generator",
                "Skill assessment engine"
            ]
        },

        "monetization": "Freemium + campus subscriptions + enterprise licensing"
    }
# ---------- API Endpoint ----------
@app.post("/generate")
def generate(req: Request):
    idea = generate_idea(req.topic)

    return {
        "input": req.topic,
        "idea": idea,
        "storage": f"stored:{hash(req.topic)}"
    }
