import { Link } from "react-router-dom";
import React, { useState } from "react";;

function ProjectCard({ title, id, subtasks, createdAt, dueDate, completed }) {
    const [showSubtasks, setShowSubtasks] = useState(false);

    function toggleSubtasks() {
      setShowSubtasks(!showSubtasks);
    };

    const completionColor = completed ? 'green' : 'red';
  
    return (
        <article className={`project-card ${completed ? 'completed' : ''}`}>
          <h2>{title}</h2>
          <p>{createdAt}</p>
          {showSubtasks && (
            <ul>
              {subtasks.map((subtask) => (
                <li key={subtask.id}>
                  {subtask.name} - {subtask.completion_status ? 'Complete' : 'Incomplete'}
                </li>
              ))}
            </ul>
          )}
          <button onClick={toggleSubtasks}>
            {showSubtasks ? "Hide Subtasks" : "Show Subtasks"}
          </button>
          <h5 style={{ color: completionColor }}>
            {completed ? "All tasks complete" : "Some tasks incomplete"}
          </h5>
          <Link to={`/projects/${id}`}>View Project Info</Link>
          <h5>Due: {dueDate}</h5>
        </article>
      );
    }

export default ProjectCard;