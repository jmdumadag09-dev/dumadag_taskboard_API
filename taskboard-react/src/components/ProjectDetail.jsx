import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ProjectDetail({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProject() {
            try {
                const data = await api(`/projects/${projectId}`);
                setProject(data.data);
            } catch (err) {
                setError(err.message);
            }
        }

        loadProject();
    }, [projectId]);

    async function handleTaskChange(taskId, isDone) {
        try {
            const data = await api(
                `/projects/${projectId}/tasks/${taskId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        is_done: isDone
                    })
                }
            );

            setProject(prev => ({
                ...prev,
                tasks: prev.tasks.map(task =>
                    task.id === taskId ? data.data : task
                )
            }));
        } catch (err) {
            setError(err.message);
        }
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={onBack}>Back</button>
            </div>
        );
    }

    if (!project) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <button onClick={onBack}>Back to Projects</button>

            <h2>{project.name}</h2>
            <p>{project.description}</p>

            <h3>Tasks</h3>

            {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map(task => (
                    <div key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.is_done}
                                onChange={e =>
                                    handleTaskChange(
                                        task.id,
                                        e.target.checked
                                    )
                                }
                            />
                            {task.title}
                        </label>
                    </div>
                ))
            ) : (
                <p>No tasks yet.</p>
            )}
        </div>
    );
}