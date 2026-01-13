import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def error_handler_agent(error_message, original_task):
    """
    Agent koji analizira grešku i predlaže rješenje
    """
    print(f"🔴 Error Handler prima grešku...\n")
    
    prompt = f"""
    Dešila se greška dok sam radio na zadatku.
    
    ORIGINALNI ZADATAK: {original_task}
    
    GREŠKA: {error_message}
    
    Analiziraj grešku i predloži:
    1. Šta je pošlo po zlu
    2. Kako popraviti
    3. Korake za rješenje
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500
    )
    
    result = response.choices[0].message.content
    print(f"✅ Error Handler predlaže:\n{result}\n")
    return result

# TEST
if __name__ == "__main__":
    test_error = "ModuleNotFoundError: No module named 'pandas'"
    test_task = "Učitaj CSV fajl i analiziraj podatke"
    error_handler_agent(test_error, test_task)