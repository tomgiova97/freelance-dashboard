"use client";
import React, { useState, useEffect } from 'react';
import { Project, Task } from '@/data/types';
import { getISOStringDate } from '@/lib/utils';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import styles from './page.module.css';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const activeProject = projects.find(p => p.id === selectedTask?.projectId);

  const getMonday = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const navigateWeek = (direction: number): void => {
    const newDate = new Date(viewDate);
    newDate.setDate(viewDate.getDate() + direction * 7);
    setViewDate(newDate);
  };

  // 1. Normalize dates to avoid timezone/time-of-day shifts
  const startOfWeek = getMonday(viewDate);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // 2. Refined Task Filter
  const isTaskInView = (task: Task): boolean => {
    const tStart = new Date(task.startDate);
    const tEnd = new Date(task.endDate);
    // Task is in view if it starts before the week ends AND ends after the week starts
    return tStart <= endOfWeek && tEnd >= startOfWeek;
  };

  // 3. Robust Grid Calculation
  const getTaskStyle = (task: Task): React.CSSProperties => {
    const tStart = new Date(task.startDate);
    const tEnd = new Date(task.endDate);

    // Clamp the task dates to the current week's boundaries for visual calculation
    const visualStart = tStart < startOfWeek ? startOfWeek : tStart;
    const visualEnd = tEnd > endOfWeek ? endOfWeek : tEnd;

    // Calculate day difference (milliseconds to days)
    const diffInMs = visualStart.getTime() - startOfWeek.getTime();
    const startCol = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

    const spanInMs = visualEnd.getTime() - visualStart.getTime();
    const span = Math.floor(spanInMs / (1000 * 60 * 60 * 24)) + 1;

    return {
      gridColumn: `${startCol} / span ${span}`,
    };
  };

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const startDate = getISOStringDate(startOfWeek);
      const endDate = getISOStringDate(endOfWeek);
      const res = await fetch(`api/projects?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      setProjects(data);
    };

    const fetchTasks = async () => {
      const startDate = getISOStringDate(startOfWeek);
      const endDate = getISOStringDate(endOfWeek);
      const res = await fetch(`api/tasks?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      setTasks(data);
    };

    fetchProjects();
    fetchTasks();
  }, [viewDate]);

  return (
    <div className={styles.container}>
      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={() => navigateWeek(-1)}>
          <span>←</span> Previous Week
        </button>
        <h2>
          {startOfWeek.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} -
          {daysOfWeek[6].toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h2>
        <button className={styles.navBtn} onClick={() => navigateWeek(1)}>
          Next Week <span>→</span>
        </button>
      </div>

      <main className={styles.timelineContainer}>
        <div className={styles.daysGrid}>
          <div className={styles.spacer}></div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={i} className={styles.dayLabel}>
              {day} <br /> <strong>{daysOfWeek[i].getDate()}</strong>
            </div>
          ))}
        </div>

        {projects.map((project: Project) => (
          <section key={project.id} className={styles.projectRow}>
            <div className={styles.projectInfo}>
              <strong>{project.title}</strong>
              <span>{project.companyName}</span>
            </div>

            <div className={styles.taskChannel}>
              {tasks
                .filter((t: Task) => t.projectId === project.id && isTaskInView(t))
                .map((task: Task) => (
                  <div
                    key={task.id}
                    className={styles.taskBar}
                    style={getTaskStyle(task)}
                    onClick={() => setSelectedTask(task)} // OPEN MODAL
                  >
                    {task.description}
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>

      {selectedTask &&
        <TaskCard task={selectedTask} project={activeProject} onClose={() => setSelectedTask(null)}></TaskCard>
      }
    </div>
  );
};

export default Dashboard;