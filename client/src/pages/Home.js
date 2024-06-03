import React, { useState, useEffect } from 'react';
import NavBar from "../components/Navbar";
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Login from '../components/Login';
import RegistrationForm from '../components/RegistrationForm';

function Home() {
  const [projects, setProjects] = useState([]);
  const [searchedProjects, setSearchedProjects] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [warningData, setWarningData] = useState('');

  useEffect(() => {
    fetch('/projects')
      .then(response => response.json())
      .then(data => {
        // Add completion status to each project
        const projectsWithCompletion = data.map(project => ({
          ...project,
          completed: project.subtasks.every(subtask => subtask.completion_status)
        }));
        setProjects(projectsWithCompletion);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    fetch("/check_session").then((res) => {
      if (res.ok) {
        res.json().then((user) => {
          setUser(user)
          console.log(user.username)
          console.log(user.id)
        })
      }
    });
  }, []);

  function handleLogin(user) {
    if (user.username) {
      setUser(user);
      console.log(user.username);
      console.log(user.id);
    } else {
      setWarningData("Wrong Username or Password");
      // Add styling for the warning
      document.getElementById('warning').style.color = 'red';
      // Hide the warning after ten seconds
      setTimeout(() => {
        setWarningData(""); // Clear the warning
      }, 10000); // 10 seconds in milliseconds
    }
  }

  function handleLogout() {
    setUser(null)
  }

  function handleRegister(user) {
    console.log("User registered:", user);
    setUser(user);
    setUsers([...users, user]);
    console.log("Updated user state:", user);
  }

  function handleAddProject(newProject) {
    setProjects([...projects, { ...newProject, completed: false }]);
  }

  function handleSearch(e) {
    setSearchedProjects(e.target.value);
  }

  function toggleProjectCompletion(projectId) {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              completed: project.subtasks.every(subtask => subtask.completion_status)
          }
          : project
      )
    );
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchedProjects.toLowerCase())
  );

  return (
    <div>
      <NavBar onLogout={handleLogout} user={user}/>
      {!user ? (
        <h1>Please Login</h1>
      ) : (
        <h1>Welcome to Your Task Manager, {user.username} ({user.position})!</h1>
      )}
      {!user ? (
        <>
          <Login onLogin={handleLogin} />
          <p id='warning'>{warningData}</p>
          <RegistrationForm onRegister={handleRegister} />
        </>
      ) : (
      <div>
        <p>Hello, {user.username}</p>
        <input
          type="text"
          placeholder="Search projects by name"
          value={searchedProjects}
          onChange={handleSearch}
        />
        <h2>Projects</h2>
        <div className="project-cards">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              id={project.id}
              subtasks={project.subtasks.map((subtask) => subtask.name)}
              createdAt={project.created_at}
              dueDate={project.due_date}
              completed={project.completed} // Pass completion status to ProjectCard
              onToggleCompletion={toggleProjectCompletion} // Pass function to toggle completion status
            />
          ))}
        </div>
        <ProjectForm addProject={handleAddProject} userIdForProjects={user.id} />
      </div> )}
    </div>
  );
};

export default Home;
