import { useState } from 'react';
import LoginForm from './components/LoginForm';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import AddProjectForm from './components/AddProjectForm';
import LogoutButton from './components/LogoutButton';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [refresh, setRefresh] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);

    function handleLogin() {
        setToken(localStorage.getItem('token'));
    }

    function handleLogout() {
        setToken(null);
    }

    function handleProjectAdded() {
        setRefresh(refresh + 1);
    }

    if (!token) {
        return <LoginForm onLogin={handleLogin} />;
    }

    if (selectedProject) {
        return (
            <ProjectDetail
                projectId={selectedProject}
                onBack={() => setSelectedProject(null)}
            />
        );
    }

    return (
        <div>
            <h1>TaskBoard</h1>

            <LogoutButton onLogout={handleLogout} />

            <AddProjectForm onAdded={handleProjectAdded} />

            <ProjectList
                refresh={refresh}
                onSelectProject={setSelectedProject}
            />
        </div>
    );
}

export default App;