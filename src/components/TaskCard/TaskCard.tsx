"use client";

import React from "react";
import styles from "./TaskCard.module.css";
import { Project, Task } from "@/data/types";

interface TaskCardProps {
    task: Task;
    project: Project | undefined;
    onClose: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, project, onClose }) => {

    return (<div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cardHeader}>
                <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>TASK DETAIL</label>
                    <h3 style={{ margin: '4px 0' }}>{task.description}</h3>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.infoGroup}>
                    <label>Project</label>
                    <p>{project?.title} ({project?.companyName})</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className={styles.infoGroup}>
                        <label>Start Date</label>
                        <p>{new Date(task.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>Due Date</label>
                        <p style={{ color: '#e11d48' }}>{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className={styles.infoGroup}>
                    <label>Compensation Info</label>
                    <p> {project?.currency} {project?.compensation} ({project?.compensationRate})</p>
                </div>
            </div>
        </div>
    </div>)

}