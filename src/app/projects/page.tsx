"use client";
import React, { useState, useEffect } from 'react';
import { Project, Task } from '@/data/types';
import styles from './page.module.css';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Array<Project>>([]);
    const [projectTasks, setProjectTasks] = useState<Array<Task>>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Sort: Most recent startDate first
    const sortedProjects = [...projects].sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const selectedProject = sortedProjects.find(p => p.id === selectedProjectId);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await fetch(`api/projects`);
            const data = await res.json();
            setProjects(data);
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchProjectTasks = async () => {
            if (selectedProjectId) {
                const res = await fetch(`api/tasks/project/${selectedProjectId}`);
                const data = await res.json();
                setProjectTasks(data);
            }
        };

        fetchProjectTasks();
    }, [selectedProjectId]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Projects</h1>
                <p>Total active contracts: {projects.length}</p>
            </header>

            <div className={styles.mainContent}>
                {/* PROJECT LIST */}
                <div className={styles.projectList}>
                    {sortedProjects.map((project) => (
                        <div
                            key={project.id}
                            className={`${styles.projectCard} ${selectedProjectId === project.id ? styles.selected : ''}`}
                            onClick={() => setSelectedProjectId(project.id)}
                        >
                            <div className={styles.cardTop}>
                                <span className={styles.company}>{project.companyName}</span>
                                <span className={styles.date}>
                                    {new Date(project.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <h3>{project.title}</h3>
                            <div className={styles.cardBottom}>
                                <span className={styles.compensation}>
                                    ${project.compensation.toLocaleString()} <small>/{project.compensationRate}</small>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DETAIL PANEL */}
                <div className={`${styles.detailPanel} ${selectedProject ? styles.panelOpen : ''}`}>
                    {selectedProject ? (
                        <div className={styles.detailContent}>
                            <button className={styles.closeBtn} onClick={() => setSelectedProjectId(null)}>✕ Close</button>

                            <div className={styles.detailHeader}>
                                <div className={styles.badge}>Active Project</div>
                                <h2>{selectedProject.title}</h2>
                                <p className={styles.description}>{selectedProject.description}</p>
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.statBox}>
                                    <label>Company</label>
                                    <p>{selectedProject.companyName}</p>
                                </div>
                                <div className={styles.statBox}>
                                    <label>Accumulated</label>
                                    <p className={styles.highlight}>${selectedProject.cumulatedCompensation}</p>
                                </div>
                            </div>

                            <div className={styles.taskListSection}>
                                <h3>Associated Tasks</h3>
                                {projectTasks.length > 0 ? (
                                    <div className={styles.tasksStack}>
                                        {projectTasks.map(task => (
                                            <div key={task.id} className={styles.taskItem}>
                                                <div className={styles.taskInfo}>
                                                    <strong>{task.description}</strong>
                                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className={styles.statusDot}></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.empty}>No tasks assigned to this project yet.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Select a project to see details and tasks</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;