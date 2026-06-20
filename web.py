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
        "startup_idea": f"AI-powered assistant for {topic}",
        "problem": f"Students struggle to gain real-world experience in {topic}",
        "solution": f"An AI mentor that guides projects, explains concepts, and helps build real apps in {topic}",
        "monetization": "Freemium + campus subscriptions"
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
