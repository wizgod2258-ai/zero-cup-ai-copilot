from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ FIX: allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    topic: str

def generate_idea(topic):
    return {
        "input": topic,

        "startup_idea": f"AI-powered assistant for {topic}",

        "problem": f"Students struggle to gain real-world experience in {topic}",

        "solution": f"An AI mentor that guides projects, explains concepts, and helps build real apps in {topic}",

        "roadmap": [
            "Learn fundamentals",
            "Build mini projects",
            "Deploy real application"
        ],

        "monetization": "Freemium + campus subscriptions",

        "0g_memory": f"stored:{hash(topic)}"
    }

@app.post("/generate")
def generate(req: Request):
    idea = generate_idea(req.topic)

    return {
        "input": req.topic,
        "idea": idea,
        "storage": f"stored:{hash(req.topic)}"
    }
