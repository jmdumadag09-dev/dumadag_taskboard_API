import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ProjectList({ refresh, onSelectProject }) {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await api('/projects');
                setProjects(data.data);
            } catch (err) {
                setError(err.message);
            }
        }

        loadProjects();
    }, [refresh]);

    return (
        <div>
            <h2>Projects</h2>

            {error && <p>{error}</p>}

            {projects.length === 0 ? (
                <p>No projects yet.</p>
            ) : (
                projects.map(project => (
                    <div key={project.id}>
                        <h3>
                            <button onClick={() => onSelectProject(project.id)}>
                                {project.name}
                            </button>
                        </h3>

                        <p>Tasks: {project.tasks_count ?? 0}</p>
                    </div>
                ))
            )}
        </div>
    );
}