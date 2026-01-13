import tkinter as tk
from tkinter import messagebox
import sqlite3

# Kreiranje baze podataka
conn = sqlite3.connect('todo.db')
c = conn.cursor()

# Kreiranje tabele za taskove
c.execute '''CREATE TABLE IF NOT EXISTS taskovi
            (id INTEGER PRIMARY KEY AUTOINCREMENT, tekst TEXT, obavljen INTEGER)'''

# Funkcija za dodavanje novog taska
def dodaj_task():
    tekst = entry_task.get()
    if tekst:
        c.execute("INSERT INTO taskovi (tekst, obavljen) VALUES (?, ?)", (tekst, 0))
        conn.commit()
        entry_task.delete(0, tk.END)
        listbox_taskovi.delete(0, tk.END)
        popuni_listbox()

# Funkcija za brisanje taska
def obrisi_task():
    try:
        task_id = listbox_taskovi.curselection()[0]
        c.execute("DELETE FROM taskovi WHERE id=(?)", (task_id + 1,))
        conn.commit()
        listbox_taskovi.delete(task_id)
    except:
        messagebox.showwarning("Greška", "Prvo odaberite task koji želite obrisati")

# Funkcija za izučavanje taskova
def izuci_taskove():
    c.execute("SELECT * FROM taskovi")
    taskovi = c.fetchall()
    for task in taskovi:
        print(f"ID: {task[0]}, Tekst: {task[1]}, Obavljen: {task[2]}")

# Funkcija za označavanje taska kao obavljenog
def oznaci_obavljen():
    try:
        task_id = listbox_taskovi.curselection()[0]
        c.execute("SELECT obavljen FROM taskovi WHERE id=(?)", (task_id + 1,))
        obavljen = c.fetchone()[0]
        if obavljen == 0:
            c.execute("UPDATE taskovi SET obavljen = 1 WHERE id=(?)", (task_id + 1,))
        else:
            c.execute("UPDATE taskovi SET obavljen = 0 WHERE id=(?)", (task_id + 1,))
        conn.commit()
        listbox_taskovi.delete(0, tk.END)
        popuni_listbox()
    except:
        messagebox.showwarning("Greška", "Prvo odaberite task koji želite označiti kao obavljen")

# Funkcija za popunjavanje liste taskova
def popuni_listbox():
    c.execute("SELECT * FROM taskovi")
    taskovi = c.fetchall()
    for task in taskovi:
        if task[2] == 0:
            listbox_taskovi.insert(tk.END, f"ID: {task[0]}, {task[1]}")
        else:
            listbox_taskovi.insert(tk.END, f"ID: {task[0]}, {task[1]} (OBRAĐENO)")

# Glavni prozor
root = tk.Tk()
root.title("Todo lista")

# Unos taska
label_task = tk.Label(root, text="Unesite task:")
label_task.pack()
entry_task = tk.Entry(root, width=40)
entry_task.pack()

# Dugme za dodavanje taska
button_dodaj = tk.Button(root, text="Dodaj task", command=dodaj_task)
button_dodaj.pack()

# Lista taskova
listbox_taskovi = tk.Listbox(root, width=40)
listbox_taskovi.pack()

# Dugme za brisanje taska
button_obrisi = tk.Button(root, text="Obriši task", command=obrisi_task)
button_obrisi.pack()

# Dugme za izučavanje taskova
button_izuci = tk.Button(root, text="Izuci taskove", command=izuci_taskove)
button_izuci.pack()

# Dugme za označavanje taska kao obavljenog
button_oznaci = tk.Button(root, text="Označi task kao obavljen", command=oznaci_obavljen)
button_oznaci.pack()

# Pokretanje GUI-a
root.mainloop()

# Zatvaranje baze podataka
conn.close()