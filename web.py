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
        "startup_idea": f"AI-powered education assistant specialized in {topic}",

        "problem": (
            f"Students and beginners struggle to understand real-world applications of {topic} "
            "and lack guided project experience."
        ),

        "solution": (
            f"An intelligent AI mentor that teaches {topic} through hands-on projects, "
            "step-by-step guidance, and real-world simulations."
        ),

        "target_users": "Students, beginners, self-learners, and bootcamp users",

        "monetization": "Freemium model + paid campus subscriptions + premium project packs",

        "mvp_plan": [
            "AI chat tutor for learning concepts",
            "Project-based learning modules",
            "Step-by-step guided builder",
            "Cloud project workspace"
        ]
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
