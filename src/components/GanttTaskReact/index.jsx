import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

/**
 * Componente Gantt usando gantt-task-react
 * Più potente e nativo React rispetto a Frappe Gantt
 */
export const GanttTaskReact = ({ 
  tasks = [], 
  viewMode = ViewMode.QuarterDay,
  onTaskClick,
  onTaskChange,
  onProgressChange 
}) => {
  
  // Converti viewMode string in ViewMode enum se necessario
  const getViewMode = (mode) => {
    const modes = {
      'Quarter Day': ViewMode.QuarterDay,
      'Half Day': ViewMode.HalfDay,
      'Day': ViewMode.Day,
      'Week': ViewMode.Week,
      'Month': ViewMode.Month,
      'Year': ViewMode.Year
    };
    return modes[mode] || ViewMode.QuarterDay;
  };

  const handleTaskChange = (task) => {
    if (onTaskChange) {
      onTaskChange(task);
    }
  };

  const handleProgressChange = (task) => {
    if (onProgressChange) {
      onProgressChange(task);
    }
  };

  const handleTaskClick = (task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  // Se non ci sono task, mostra messaggio
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        fontSize: '16px'
      }}>
        Nessun task da visualizzare
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <Gantt
        tasks={tasks}
        viewMode={typeof viewMode === 'string' ? getViewMode(viewMode) : viewMode}
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onClick={handleTaskClick}
        locale="it"
        listCellWidth="155px"
        columnWidth={60}
        barBackgroundColor="#3b82f6"
        barBackgroundSelectedColor="#1e40af"
        barProgressColor="#60a5fa"
        barProgressSelectedColor="#3b82f6"
        arrowColor="#94a3b8"
        arrowIndent={20}
        fontSize="14px"
        fontFamily="Arial, sans-serif"
        rowHeight={50}
        headerHeight={50}
        todayColor="rgba(239, 68, 68, 0.2)"
      />
    </div>
  );
};

export default GanttTaskReact;
