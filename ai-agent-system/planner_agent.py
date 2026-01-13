import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def planner_agent(task):
    """
    Agent koji pravi detaljan plan za izvršenje zadatka
    """
    print(f"📋 Planner Agent prima zadatak: {task}\n")
    
    prompt = f"""
    Ti si ekspert za planiranje projekata. Tvoj zadatak je da napraviš DETALJAN PLAN.
    
    ZADATAK: {task}
    
    Napravi plan koji sadrži:
    1. ANALIZU zadatka (šta se tačno traži)
    2. KORAKE (numerisane, konkretne akcije)
    3. POTREBNE ALATE/BIBLIOTEKE
    4. MOGUĆE PREPREKE
    5. PROCJENU VREMENA
    
    Budi KONKRETAN i JASAN.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )
    
    result = response.choices[0].message.content
    print(f"✅ Planner Agent kreirao plan:\n{result}\n")
    return result

# TEST
if __name__ == "__main__":
    planner_agent("Napravi jednostavnu Todo listu aplikaciju u Pythonu")
    