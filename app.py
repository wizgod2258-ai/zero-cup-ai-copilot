def generate_idea(topic):
    return f"""
Startup Idea:
Build an AI-powered app focused on {topic}

Problem:
Students struggle with practical experience in {topic}

Solution:
An AI assistant that helps students learn and build real projects in {topic}

Monetization:
Freemium + campus subscriptions
"""

def store_data(data):
    print("[0G STORAGE MOCK] saving idea...")
    return f"stored:{hash(data)}"

def main():
    print("🚀 Zero Cup Startup Generator")

    topic = input("Enter your interest (e.g. AI, fintech, education): ")

    idea = generate_idea(topic)
    storage_id = store_data(idea)

    print("\n===== GENERATED STARTUP IDEA =====")
    print(idea)
    print("Storage ID:", storage_id)

if __name__ == "__main__":
    main()
