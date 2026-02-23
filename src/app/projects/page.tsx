"use client";
import React, { useState, useEffect } from 'react';
import { Project, Task, CompensationRate } from '@/data/types';
import styles from './page.module.css';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Array<Project>>([]);
    const [projectTasks, setProjectTasks] = useState<Array<Task>>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const [projectForm, setProjectForm] = useState({
        title: '', companyName: '', description: '',
        compensation: '', compensationRate: 'one-time' as CompensationRate,
        startDate: '', endDate: ''
    });

    const [taskForm, setTaskForm] = useState({
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dueDate: ''
    });

    // Sort: Most recent startDate first
    const sortedProjects = [...projects].sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const selectedProject = sortedProjects.find(p => (p.id || (p as any)._id) === selectedProjectId);

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

    const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...projectForm, compensation: Number(projectForm.compensation) }),
        });
        if (res.ok) {
            const newProj = await res.json();
            setProjects([newProj, ...projects]);
            setIsProjectModalOpen(false);
            setProjectForm({ title: '', companyName: '', description: '', compensation: '', compensationRate: 'one-time', startDate: '', endDate: '' });
            alert('Project created successfully');
        }
    };

    const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...taskForm, projectId: selectedProjectId }),
        });
        if (res.ok) {
            const newTask = await res.json();
            setProjectTasks([...projectTasks, newTask]);
            setIsTaskModalOpen(false);
            // Reset with defaults
            setTaskForm({
                description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                dueDate: ''
            });
            alert('Task created successfully');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>My Projects</h1>
                    <p>Total active contracts: {projects.length}</p>
                </div>
                <button className={styles.addBtn} onClick={() => setIsProjectModalOpen(true)}>+ New Project</button>
            </header>

            <div className={styles.mainContent}>
                {/* PROJECT LIST */}
                <div className={styles.projectList}>
                    {sortedProjects.map((project) => (
                        <div
                            key={project.id || (project as any)._id}
                            className={`${styles.projectCard} ${selectedProjectId === (project.id || (project as any)._id) ? styles.selected : ''}`}
                            onClick={() => setSelectedProjectId(project.id || (project as any)._id)}
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
                                <div className={styles.taskHeader}>
                                    <h3>Associated Tasks</h3>
                                    <button className={styles.miniAddBtn} onClick={() => setIsTaskModalOpen(true)}>+ Add Task</button>
                                </div>
                                {projectTasks.length > 0 ? (
                                    <div className={styles.tasksStack}>
                                        {projectTasks.map(task => (
                                            <div key={task.id || (task as any)._id} className={styles.taskItem}>
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

            {/* PROJECT MODAL */}
            {isProjectModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Create New Project</h3>
                        <form className={styles.form} onSubmit={handleProjectSubmit}>
                            <div className={styles.inputGroup}><label>Title</label><input required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} /></div>
                            <div className={styles.inputGroup}><label>Company</label><input required value={projectForm.companyName} onChange={e => setProjectForm({ ...projectForm, companyName: e.target.value })} /></div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}><label>Amount</label><input className={styles.amountInput} type="number" required value={projectForm.compensation} onChange={e => setProjectForm({ ...projectForm, compensation: e.target.value })} /></div>
                                <div className={styles.inputGroup}><label>Rate</label>
                                    <select value={projectForm.compensationRate} onChange={e => setProjectForm({ ...projectForm, compensationRate: e.target.value as CompensationRate })}>
                                        <option value="one-time">One-time</option><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}><label>Start</label><input type="date" required value={projectForm.startDate} onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })} /></div>
                                <div className={styles.inputGroup}><label>End</label><input type="date" required value={projectForm.endDate} onChange={e => setProjectForm({ ...projectForm, endDate: e.target.value })} /></div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsProjectModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Save Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TASK MODAL */}
            {isTaskModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Add Task to {selectedProject?.title}</h3>
                        <form className={styles.form} onSubmit={handleTaskSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Description</label>
                                <input
                                    required
                                    placeholder="e.g., Design System Update"
                                    value={taskForm.description}
                                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={taskForm.startDate}
                                        onChange={e => setTaskForm({ ...taskForm, startDate: e.target.value })}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={taskForm.endDate}
                                        onChange={e => setTaskForm({ ...taskForm, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Final Deadline (Due Date)</label>
                                <input
                                    type="date"
                                    required
                                    value={taskForm.dueDate}
                                    onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setIsTaskModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;