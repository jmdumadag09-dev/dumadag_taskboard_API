import { useState } from 'react';
import { api } from '../api';

export default function AddProjectForm({ onAdded }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const data = await api('/projects', {
                method: 'POST',
                body: JSON.stringify({
                    name
                })
            });

            onAdded(data.data);
            setName('');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <h2>Add Project</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button type="submit">Add Project</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}