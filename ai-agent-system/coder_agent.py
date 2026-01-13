import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def coder_agent(task, plan):
    """
    Agent koji piše kod na osnovu plana
    """
    print(f"💻 Coder Agent prima zadatak i plan...\n")
    
    prompt = f"""
    Ti si ekspertni Python programer. 
    
    ZADATAK: {task}
    
    PLAN KOJI TREBA IZVRŠITI:
    {plan}
    
    Napiši KOMPLETAN Python kod koji rješava zadatak prema planu.
    
    PRAVILA:
    - Kod mora biti funkcionalan i spreman za pokretanje
    - Dodaj komentare za objašnjenje
    - Koristi best practices
    - NE koristi externe biblioteke osim standardnih Python biblioteka
    
    Vrati SAMO KOD, bez dodatnih objašnjenja.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000
    )
    
    result = response.choices[0].message.content
    print(f"✅ Coder Agent napisao kod:\n{result}\n")
    return result

# TEST
if __name__ == "__main__":
    test_task = "Napravi jednostavnu Todo listu aplikaciju"
    test_plan = "1. Napravi liste za zadatke\n2. Dodaj funkciju za unos\n3. Dodaj funkciju za prikaz"
    coder_agent(test_task, test_plan)