import { useState, useEffect } from "react";
import { ViewMode } from "gantt-task-react";
import { GanttTaskReact } from "../components/GanttTaskReact";
import {
  parseCSVToGanttTaskReact,
  calculateTaskStats,
  filterTasksByResource
} from "../utils/ganttTaskReactParser";


// Dati CSV importati direttamente
const CSV_DATA = `Task Name,Start Date,Duration,Resources
CALL Google Meet con il team (riunione),2025-11-28,2.5h,Sandu/Mattia/Catalin/Andrea
CALL Google Meet con il team (riunione),2025-12-11,2h,Sandu/Mattia/Catalin/Andrea
CALL Google Meet con il team (riunione),2025-12-13,2h,Sandu/Mattia/Catalin/Andrea
creazione schema analisi SWOT,2025-12-15,4h,Sandu
creazione WBS,2025-12-15,3h,Andrea
creazione Mokup,2025-12-15,8h,Catalin
creazione Schema GANTT,2025-12-15,8h,Andrea
CALL Google Meet con il team (riunione),2025-12-15,1.5h,Sandu/Mattia/Catalin/Andrea
configurazione repository fronend in GitHub,2025-12-15,3h,Sandu/Mattia/Catalin/Andrea
installazione progetto React/Vite,2025-12-16,1h,Sandu/Mattia/Catalin/Andrea
configurazione cloud Vercel per deploy frontend con React/Vite,2025-12-17,2h,Sandu/Mattia/Catalin/Andrea
creazione EndScreen.jsx: schermata di fine partita.,2025-12-17,2h,Catalin
creazione VersusSetup.jsx: configurazione in modalità 1 VS 1,2025-12-18,2h,Catalin
creazione ColorPicker.jsx: selettore colori per sequenza segreta,2025-12-19,0.5h,Catalin
creazione GuessRow: riga di tentativo singolo,2025-12-20,2h,Catalin
creazione GameBoard.jsx: area di gioco principale,2025-12-21,2h,Catalin
CALL Google Meet con il team (riunione),2025-12-28,1.5h,Sandu/Mattia/Catalin/Andrea
creazione BombHeader.jsx: componente di intestazione del gioco,2025-12-28,1h,Catalin
implementazione dell'inglese come lingua base dell'app, 2025-12-28,3h,Catalin
creazione MainMenu.jsx: interfaccia per la scelta modalità di gioco,2025-12-29,3h,Sandu
creazione modale tuotorial del gioco,2025-12-29,4h,Catalin
creazione classifica, 2025-12-29,5h,Andrea
CALL Google Meet con il team (riunione),2025-12-30,1.5h,Sandu/Mattia/Catalin/Andrea
creazione schermata sfida giocatore,2025-12-30,1.5h,Andrea
CALL Google Meet con il team (riunione),2026-01-01,1h,Sandu/Mattia/Catalin/Andrea
creazione list utenti loggati (da sfidare online),2026-01-02,3h,Andrea
finestra di login,2026-01-02,2h,Sandu
finestra di registrazione,2026-01-02,2h,Catalin
implementazione responsive mobile,2026-01-05,3h,Andrea
inserimento pulsante Login/Logout,2026-01-08,3h,Catalin
Inserimento validazione username=email,2026-01-10,2h,Andrea
Gestione recupero password,2026-01-12,h4,Andrea
configurazione repository backend in GitHub,2025-12-16,3h,Sandu/Mattia/Catalin/Andrea
configurazione cloud Neon per deploy  database PostgreSQL,2025-12-16,1.5h,Catalin/Andrea
configurazione cloud Render.com per deploy backend in Node.js/Express.js,2025-12-16,2h,Sandu/Mattia/Catalin/Andrea
installazione progetto Node.js/Express.js,2025-12-17,1h,Catalin/Andrea/Sandu/Mattia
creazione Token JWT con cookie HttpOnly e autorizzazione accesso a modalità 1 VS 1,2025-12-18,6h,Andrea
creazione controller Socket.io per lancio della sfida in modalità 1 VS 1,2025-12-19,3h,Andrea
creazione API elenco utenti loggati (online),2025-12-19,3h,Andrea
creazione API di registrazione,2025-12-20,2h,Andrea
creazione API di Login,2025-12-20,2h,Andrea
registrazione: controllo se l'utente è loggato,2025-12-20,2h,Catalin
registrazione: codificare utente password,2025-12-20,1h,Andrea
registrazione: implementazione del ruolo utente,2025-12-20,1h,Catalin
creazione connessione a database,2025-12-21,1h,Andrea
creazione server Express per sviluppo,2025-12-21,1h,Andrea
creazione tabella utenti in Neon,2025-12-21,1h,Catalin/Andrea
CALL Google Meet con il team (riunione),2025-12-22,1.5h,Sandu/Mattia/Catalin/Andrea
registrazione: username univoco,2025-12-22,1h,Catalin
creazione API classifica utenti,2025-12-22,3h,Andrea
creazione controller Socket.io con relativo modulo,2025-12-23,5h,Sandu
CALL Google Meet con il team ,2025-12-24,1.5h,Sandu/Mattia/Catalin/Andrea
CALL Google Meet con il team (riunione),2026-01-03,1.5h,Sandu/Mattia/Catalin/Andrea`;

export const ProjectGanttTaskReact = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.QuarterDay);
  const [selectedResource, setSelectedResource] = useState("");
  const [stats, setStats] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const tasks = parseCSVToGanttTaskReact(CSV_DATA);
    setAllTasks(tasks);
    setFilteredTasks(tasks);
    setStats(calculateTaskStats(tasks));
  }, []);

  useEffect(() => {
    if (selectedResource) {
      const filtered = filterTasksByResource(allTasks, selectedResource);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(allTasks);
    }
  }, [selectedResource, allTasks]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    console.log("Task cliccato:", task);
  };

  const handleTaskChange = (task) => {
    console.log("Task modificato:", task);
    // Aggiorna lo stato se necessario
    setAllTasks(prevTasks =>
      prevTasks.map(t => t.id === task.id ? task : t)
    );
  };

  const viewModes = [
    { label: "Quarter Day", value: ViewMode.QuarterDay },
    { label: "Half Day", value: ViewMode.HalfDay },
    { label: "Day", value: ViewMode.Day },
    { label: "Week", value: ViewMode.Week },
    { label: "Month", value: ViewMode.Month }
  ];

  if (!stats) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "white",
        fontSize: "1.5rem"
      }}>
        Caricamento...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "white",
          fontSize: "2.5rem",
          marginBottom: "10px",
          fontFamily: "Orbitron, sans-serif"
        }}>
          📊 Mastermind Project Timeline
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
          Powered by gantt-task-react
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>
        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #334155"
        }}>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "5px" }}>
            Totale Task
          </div>
          <div style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}>
            {stats.total}
          </div>
        </div>

        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #06b6d4"
        }}>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "5px" }}>
            Ore Totali
          </div>
          <div style={{ color: "#06b6d4", fontSize: "2rem", fontWeight: "bold" }}>
            {stats.totalHours}h
          </div>
        </div>

        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #10b981"
        }}>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "5px" }}>
            Ore Completate
          </div>
          <div style={{ color: "#10b981", fontSize: "2rem", fontWeight: "bold" }}>
            {stats.completedHours}h
          </div>
        </div>

        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #f59e0b"
        }}>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "5px" }}>
            Progresso
          </div>
          <div style={{ color: "#f59e0b", fontSize: "2rem", fontWeight: "bold" }}>
            {stats.avgProgress}%
          </div>
        </div>

        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ec4899"
        }}>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "5px" }}>
            Team Members
          </div>
          <div style={{ color: "#ec4899", fontSize: "2rem", fontWeight: "bold" }}>
            {stats.resourceCount}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        marginBottom: "20px"
      }}>
        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #334155"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}>
            {/* View Mode */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ color: "white", fontWeight: "bold", marginRight: "10px" }}>
                Vista:
              </span>
              {viewModes.map(mode => (
                <button
                  key={mode.label}
                  onClick={() => setViewMode(mode.value)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: viewMode === mode.value ? "#3b82f6" : "#334155",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: viewMode === mode.value ? "bold" : "normal"
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Resource Filter */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ color: "white", fontWeight: "bold" }}>
                Filtra per:
              </span>
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#334155",
                  color: "white",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                <option value="">Tutti i membri</option>
                {stats.resources.map(resource => (
                  <option key={resource} value={resource}>
                    {resource}
                  </option>
                ))}
              </select>
              {selectedResource && (
                <button
                  onClick={() => setSelectedResource("")}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  ✕ Rimuovi filtro
                </button>
              )}
            </div>
          </div>

          {selectedResource && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#0f172a",
              borderRadius: "6px",
              color: "#94a3b8"
            }}>
              Mostrando {filteredTasks.length} task assegnati a <strong style={{ color: "white" }}>{selectedResource}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Gantt Chart */}
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        marginBottom: "30px",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px"
      }}>
        <GanttTaskReact
          tasks={filteredTasks}
          viewMode={viewMode}
          onTaskClick={handleTaskClick}
          onTaskChange={handleTaskChange}
        />
      </div>

      {/* Task Details */}
      {selectedTask && (
        <div style={{
          maxWidth: "1600px",
          margin: "0 auto",
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #334155"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "15px"
          }}>
            <h3 style={{ color: "white", margin: 0 }}>
              📋 {selectedTask._originalName || selectedTask.name}
            </h3>
            <button
              onClick={() => setSelectedTask(null)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#334155",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              ✕ Chiudi
            </button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            color: "#94a3b8"
          }}>
            <div>
              <strong style={{ color: "white" }}>Data Inizio:</strong>{" "}
              {selectedTask.start.toLocaleDateString('it-IT')}
            </div>
            <div>
              <strong style={{ color: "white" }}>Data Fine:</strong>{" "}
              {selectedTask.end.toLocaleDateString('it-IT')}
            </div>
            <div>
              <strong style={{ color: "white" }}>Durata:</strong> {selectedTask._duration}
            </div>
            <div>
              <strong style={{ color: "white" }}>Progresso:</strong>{" "}
              <span style={{
                color: selectedTask.progress === 100 ? "#10b981" :
                  selectedTask.progress > 50 ? "#3b82f6" : "#f59e0b"
              }}>
                {selectedTask.progress}%
              </span>
            </div>
            {selectedTask._resources && (
              <div style={{ gridColumn: "1 / -1" }}>
                <strong style={{ color: "white" }}>Risorse Assegnate:</strong>{" "}
                {selectedTask._resources.split('/').map((resource, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      margin: "4px",
                      backgroundColor: "#334155",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  >
                    {resource.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGanttTaskReact;
