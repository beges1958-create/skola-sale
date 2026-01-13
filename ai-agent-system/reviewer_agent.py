import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def reviewer_agent(code, task):
    """
    Agent koji provjerava kod i traži greške
    """
    print(f"🔍 Reviewer Agent provjerava kod...\n")
    
    prompt = f"""
    Ti si ekspertni code reviewer. Tvoj zadatak je da proveriš kod i pronađeš greške.
    
    ORIGINALNI ZADATAK: {task}
    
    KOD ZA PROVJERU:
    {code}
    
    Analiziraj kod i napravi:
    1. LISTA GREŠAKA (sintaksne greške, logičke greške, typo)
    2. OZBILJNOST (kritična/srednja/mala)
    3. TAČNA LINIJA gdje je greška
    4. PREDLOG POPRAVKE (kako ispraviti)
    
    Ako nema grešaka, napiši "KOD JE ISPRAVAN ✅"
    
    Budi KONKRETAN i JASAN.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )
    
    result = response.choices[0].message.content
    print(f"✅ Reviewer Agent završio pregled:\n{result}\n")
    return result

# TEST
if __name__ == "__main__":
    test_code = """
def osvjezi_listu():
    lista_zadataka.delete(0, tk.END)
    for zadatak in zadaci:
        lista_zadatak.insert(tk.END, zadatak)
"""
    reviewer_agent(test_code, "Todo lista aplikacija")