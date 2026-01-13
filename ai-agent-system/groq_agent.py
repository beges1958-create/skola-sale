import os
from dotenv import load_dotenv
from groq import Groq

# Učitaj API ključ
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Funkcija koja šalje zadatak AI agentu
def agent_task(task):
    print(f"🤖 Agent prima zadatak: {task}\n")
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": task}],
        max_tokens=2000
    )
    
    result = response.choices[0].message.content
    print(f"✅ Agent odgovara:\n{result}\n")
    return result

# TEST - Pokreni agenta
if __name__ == "__main__":
    agent_task("Napiši mi kratki recept za pitu sa sirom.")