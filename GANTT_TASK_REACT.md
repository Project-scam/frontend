# 📊 Gantt Chart - gantt-task-react

## 🎯 Descrizione

Il progetto ora utilizza **gantt-task-react**, una libreria React moderna e nativa per visualizzare diagrammi di Gantt interattivi.

## ✨ Funzionalità

### 📈 Dashboard con Statistiche
- **Totale Task**: Numero totale di attività
- **Ore Totali**: Somma delle ore stimate per tutte le task
- **Ore Completate**: Ore delle task completate al 100%
- **Progresso Medio**: Percentuale media di completamento
- **Team Members**: Numero di risorse coinvolte nel progetto

### 🔍 Filtri e Visualizzazioni
- **Filtro per Risorsa**: Visualizza solo le task assegnate a un membro specifico del team
- **Modalità di Vista**:
  - Quarter Day (6 ore)
  - Half Day (12 ore)
  - Day (giorno)
  - Week (settimana)
  - Month (mese)

### 🎨 Design Intelligente
- **Colori Dinamici**:
  - 🔵 **Blu**: Task individuali (1 risorsa)
  - 🔵 **Blu scuro**: Task collaborative (2-3 risorse)
  - 🟣 **Viola**: Task di team completo (4+ risorse)
- **Localizzazione Italiana**: Tutti i testi in italiano
- **Tema Scuro**: Design moderno con sfondo scuro

### 📋 Dettagli Task Interattivi
Cliccando su una task si visualizzano:
- Nome completo
- Data inizio e fine
- Durata in ore
- Progresso percentuale
- Risorse assegnate (con badge colorati)

## 🚀 Come Accedere

1. Avvia l'applicazione
2. Effettua il login (o continua come Guest)
3. Nel menu principale, clicca su **"📊 Project Gantt Chart"**
4. Visualizza il diagramma con tutte le task del progetto

## 📂 Struttura File

```
frontend/src/
├── components/
│   └── GanttTaskReact/
│       └── index.jsx           # Componente wrapper per gantt-task-react
├── pages/
│   └── ProjectGanttTaskReact.jsx  # Pagina principale con dashboard
└── utils/
    └── ganttTaskReactParser.js    # Parser CSV e utility
```

## 🔧 Configurazione

### Dati delle Task
I dati sono definiti in formato CSV direttamente in `ProjectGanttTaskReact.jsx`:

```javascript
const CSV_DATA = `Task Name,Start Date,Duration,Resources
creazione schema analisi SWOT,2025-12-15,4h,Sandu
creazione WBS,2025-12-15,3h,Andrea
...
```

### Personalizzazione Colori
Modifica `ganttTaskReactParser.js` per cambiare i colori:

```javascript
export const getTaskColors = (resources) => {
  // Personalizza i colori qui
}
```

### Stima Progresso
Il progresso è calcolato automaticamente in base alla data di inizio:

```javascript
export const estimateProgress = (startDate) => {
  // Logica di stima del progresso
}
```

## 📊 Vantaggi rispetto a Frappe-Gantt

✅ **Nativo React**: Migliore integrazione con l'ecosistema React  
✅ **TypeScript**: Supporto completo per TypeScript  
✅ **Più Interattivo**: Click, drag, resize delle task  
✅ **Design Moderno**: Stili personalizzabili e responsive  
✅ **Performance**: Ottimizzato per grandi dataset  
✅ **Manutenzione Attiva**: Libreria attivamente mantenuta  

## 📦 Dipendenze

```json
{
  "gantt-task-react": "^0.3.9"
}
```

## 🛠️ Sviluppo

### Aggiungere Nuove Task
Modifica il CSV_DATA in `ProjectGanttTaskReact.jsx`:

```csv
Task Name,Start Date,Duration,Resources
Nuova Task,2025-12-25,3h,Andrea/Catalin
```

### Modificare il Parser
Il file `ganttTaskReactParser.js` contiene tutte le utility per:
- Parse del formato CSV
- Calcolo date e durate
- Determinazione colori
- Stima progresso
- Filtri e statistiche

## 🎯 Note

- Le task sono ordinate per data di inizio
- Il progresso è stimato automaticamente in base alla data
- I colori cambiano in base al numero di risorse assegnate
- Il filtro per risorsa supporta risorse multiple (es: "Andrea/Catalin")

---

**Sviluppato per Mastermind PWSCAM Project**  
Team: Sandu, Andrea, Catalin, Mattia
