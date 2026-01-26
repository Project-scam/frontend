/**
 * Parser per convertire CSV in formato gantt-task-react
 */

/**
 * Converte durata in ore
 * @param {string} duration - Durata nel formato "4h", "1.5h", etc.
 * @returns {number} - Numero di ore
 */
export const parseDuration = (duration) => {
    if (!duration || duration.trim() === '') return 8;

    const match = duration.match(/(\d+\.?\d*)\s*h/i);
    if (match) {
        const hours = parseFloat(match[1]);
        return hours > 0 ? hours : 8;
    }

    return 8;
};

/**
 * Calcola la data di fine basata su data inizio e durata in ore
 * @param {Date} startDate - Data inizio
 * @param {number} durationHours - Durata in ore
 * @returns {Date} - Data fine
 */
export const calculateEndDate = (startDate, durationHours) => {
    const end = new Date(startDate);
    // Converti ore in millisecondi
    const milliseconds = durationHours * 60 * 60 * 1000;
    end.setTime(end.getTime() + milliseconds);
    return end;
};

/**
 * Determina il tipo di task
 * @param {number} durationHours - Durata in ore
 * @returns {string} - Tipo: 'task', 'milestone', o 'project'
 */
export const getTaskType = (durationHours) => {
    if (durationHours <= 0.5) return 'milestone';
    if (durationHours >= 40) return 'project';
    return 'task';
};

/**
 * Determina il colore del task in base alle risorse
 * @param {string} resources - Risorse assegnate
 * @returns {object} - Oggetto con colori
 */
export const getTaskColors = (resources) => {
    if (!resources) return {
        backgroundColor: '#3b82f6',
        progressColor: '#60a5fa',
        selectedColor: '#1e40af'
    };

    const resourceCount = resources.split('/').length;

    if (resourceCount >= 4) {
        return {
            backgroundColor: '#8b5cf6', // Viola - team completo
            progressColor: '#a78bfa',
            selectedColor: '#7c3aed'
        };
    }

    if (resourceCount >= 2) {
        return {
            backgroundColor: '#3b82f6', // Blu - team parziale
            progressColor: '#60a5fa',
            selectedColor: '#1e40af'
        };
    }

    return {
        backgroundColor: '#06b6d4', // Ciano - individuale
        progressColor: '#22d3ee',
        selectedColor: '#0891b2'
    };
};

/**
 * Determina il progresso stimato in base alla data
 * @param {Date} startDate - Data inizio
 * @returns {number} - Progresso stimato 0-100
 */
export const estimateProgress = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();

    const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    if (daysSinceStart < 0) return 0;
    if (daysSinceStart > 30) return 100;
    if (daysSinceStart <= 7) {
        return Math.min(30 + Math.floor((daysSinceStart / 7) * 40), 70);
    }

    return Math.min(70 + Math.floor(((daysSinceStart - 7) / 23) * 30), 100);
};

/**
 * Parse del file CSV e conversione in task per gantt-task-react
 * @param {string} csvContent - Contenuto del file CSV
 * @returns {Array} - Array di task per gantt-task-react
 */
export const parseCSVToGanttTaskReact = (csvContent) => {
    const lines = csvContent.trim().split('\n');
    const dataLines = lines.slice(1).filter(line => line.trim() !== '');

    const tasks = dataLines.map((line, index) => {
        const columns = line.split(',').map(col => col.trim());

        // Se ci sono più di 4 colonne, significa che il nome del task contiene virgole
        // Prendiamo le ultime 3 colonne come: data, durata, risorse
        // E tutto il resto come nome del task
        let taskName, startDateStr, duration, resources;

        if (columns.length >= 4) {
            // Le ultime 3 colonne sono sempre: data, durata, risorse
            resources = columns[columns.length - 1] || '';
            duration = columns[columns.length - 2] || '8h';
            startDateStr = columns[columns.length - 3] || '2024-01-01';
            // Tutto il resto è il nome del task
            taskName = columns.slice(0, columns.length - 3).join(', ').trim() || `Task ${index + 1}`;
        } else {
            // Formato standard: nome, data, durata, risorse
            taskName = columns[0] || `Task ${index + 1}`;
            startDateStr = columns[1] || '2024-01-01';
            duration = columns[2] || '8h';
            resources = columns[3] || '';
        }

        const durationHours = parseDuration(duration);

        // Valida e crea la data
        let startDate;
        try {
            // Verifica che startDateStr sia nel formato corretto (YYYY-MM-DD)
            if (!startDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(startDateStr)) {
                console.warn(`Invalid date format for task "${taskName}": "${startDateStr}". Using default date.`);
                startDateStr = '2024-01-01';
            }
            startDate = new Date(startDateStr + 'T08:00:00');

            // Verifica che la data sia valida
            if (isNaN(startDate.getTime())) {
                console.warn(`Invalid date for task "${taskName}": "${startDateStr}". Using default date.`);
                startDate = new Date('2024-01-01T08:00:00');
            }
        } catch (error) {
            console.error(`Error parsing date for task "${taskName}":`, error);
            startDate = new Date('2024-01-01T08:00:00');
        }

        const endDate = calculateEndDate(startDate, durationHours);
        const progress = estimateProgress(startDate);
        const taskType = getTaskType(durationHours);
        const colors = getTaskColors(resources);

        // Formato richiesto da gantt-task-react
        return {
            start: startDate,
            end: endDate,
            name: `${taskName} (${duration})`,
            id: `task_${index + 1}`,
            type: taskType,
            progress: progress,
            isDisabled: false,
            styles: {
                backgroundColor: colors.backgroundColor,
                backgroundSelectedColor: colors.selectedColor,
                progressColor: colors.progressColor,
                progressSelectedColor: colors.selectedColor
            },
            // Dati extra per riferimento
            _resources: resources,
            _duration: duration,
            _durationHours: durationHours,
            _originalName: taskName
        };
    });

    return tasks;
};

/**
 * Calcola statistiche sui task
 * @param {Array} tasks - Array di task
 * @returns {Object} - Statistiche
 */
export const calculateTaskStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.progress === 100).length;
    const inProgress = tasks.filter(t => t.progress > 0 && t.progress < 100).length;
    const notStarted = tasks.filter(t => t.progress === 0).length;
    const avgProgress = tasks.reduce((sum, t) => sum + t.progress, 0) / total;

    const totalHours = tasks.reduce((sum, t) => sum + (t._durationHours || 0), 0);
    const completedHours = tasks
        .filter(t => t.progress === 100)
        .reduce((sum, t) => sum + (t._durationHours || 0), 0);

    const allResources = new Set();
    tasks.forEach(task => {
        if (task._resources) {
            task._resources.split('/').forEach(r => allResources.add(r.trim()));
        }
    });

    return {
        total,
        completed,
        inProgress,
        notStarted,
        avgProgress: Math.round(avgProgress),
        resources: Array.from(allResources),
        resourceCount: allResources.size,
        totalHours: Math.round(totalHours * 10) / 10,
        completedHours: Math.round(completedHours * 10) / 10
    };
};

/**
 * Filtra task per risorsa
 * @param {Array} tasks - Array di task
 * @param {string} resource - Nome risorsa
 * @returns {Array} - Task filtrati
 */
export const filterTasksByResource = (tasks, resource) => {
    if (!resource) return tasks;

    return tasks.filter(task =>
        task._resources && task._resources.includes(resource)
    );
};
