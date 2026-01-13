import os
from dotenv import load_dotenv
from planner_agent import planner_agent
from coder_agent import coder_agent
from error_handler_agent import error_handler_agent
from reviewer_agent import reviewer_agent

load_dotenv()

def orchestrator(user_task):
    """
    Glavni agent koji koordinira sve agente
    """
    print(f"\n{'='*60}")
    print(f"🎯 ORCHESTRATOR POKRENUT")
    print(f"{'='*60}\n")
    print(f"Zadatak korisnika: {user_task}\n")
    
    total_steps = 4
    current_step = 0
    
    try:
        # KORAK 1: Planner
        current_step += 1
        print(f"[{current_step}/{total_steps}] ☐ Planner Agent...\n")
        plan = planner_agent(user_task)
        print(f"[{current_step}/{total_steps}] ✓ GOTOVO\n")
        
        # KORAK 2: Coder
        current_step += 1
        print(f"[{current_step}/{total_steps}] ☐ Coder Agent...\n")
        code = coder_agent(user_task, plan)
        print(f"[{current_step}/{total_steps}] ✓ GOTOVO\n")
        
        # KORAK 3: Reviewer
        current_step += 1
        print(f"[{current_step}/{total_steps}] ☐ Reviewer Agent...\n")
        review = reviewer_agent(code, user_task)
        print(f"[{current_step}/{total_steps}] ✓ GOTOVO\n")
        
        # KORAK 4: Čuvanje fajla
        current_step += 1
        print(f"[{current_step}/{total_steps}] ☐ Čuvanje fajla...\n")
        filename = "generated_app.py"
        with open(filename, 'w', encoding='utf-8') as f:
            # Ukloni markdown ```python oznake ako postoje
            clean_code = code.replace('```python', '').replace('```', '').strip()
            f.write(clean_code)
        print(f"[{current_step}/{total_steps}] ✓ GOTOVO\n")
        
        print(f"\n✅ Kod sačuvan u fajl: {filename}")
        print(f"\n{'='*60}")
        print(f"🎉 ZADATAK ZAVRŠEN USPJEŠNO!")
        print(f"{'='*60}\n")
        
        return code
        
    except Exception as e:
        # Ako dođe do greške, pozovi Error Handler
        print("\n❌ Greška detektovana! Pozivam Error Handler...\n")
        error_handler_agent(str(e), user_task)
        return None

# TEST
if __name__ == "__main__":
    orchestrator("Napravi jednostavnu Todo listu aplikaciju u Pythonu")