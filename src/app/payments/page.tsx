"use client";
import React, { useState, useEffect } from 'react';
import { Payment, Project, PaymentFormData } from '@/data/types';
import styles from './page.module.css';
import { FilterEnum } from '@/data/types';
import { getDatesByFilter, getISOStringDate } from '@/lib/utils';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [totalGain, setTotalGain] = useState<number>(0);
    const [formData, setFormData] = useState<PaymentFormData>({
        projectId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'USD',
    });
    const [filter, setFilter] = useState<FilterEnum>('1y');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const filterDates: [Date, Date] | null = getDatesByFilter(filter);

    useEffect(() => {
        const fetchPayments = async () => {
            if (!filterDates) {
                const res = await fetch(`api/payments`);
                const data = await res.json();
                setPayments(data.payments)
                setTotalGain(data.totalGain)
            } else {
                const startDate = getISOStringDate(filterDates[0]);
                const endDate = getISOStringDate(filterDates[1]);
                const res = await fetch(`api/payments?startDate=${startDate}&endDate=${endDate}`);
                const data = await res.json();
                setPayments(data.payments)
                setTotalGain(data.totalGain)
            }
        };

        fetchPayments();
    }, [filter]);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await fetch(`api/projects`);
            const data = await res.json();
            setProjects(data);
            setFormData({ ...formData, projectId: data[0]?.id })
        };

        fetchProjects();
    }, []);

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        // 1. Stop the browser from reloading the page
        event.preventDefault();

        // 2. Prepare the data (converting strings to numbers where needed)
        const payload = {
            projectId: formData.projectId,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date),
            currency: formData.currency,
        };

        try {
            // 3. Fire the request to your API
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to save payment');
            }

            const savedPayment = await response.json();

            // We add the new payment to the top of the list
            setPayments((currentPayments) => [savedPayment, ...currentPayments]);
            setTotalGain(totalGain + Number(formData.amount));
            // Close the modal and reset the form
            setIsModalOpen(false);
            setFormData({
                projectId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                currency: 'USD',
            });


            alert('Payment logged successfully!');

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong.');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Payments</h1>
                    <p>Track your revenue and invoices</p>
                </div>
                <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    + Add Payment
                </button>
            </header>

            {/* SUMMARY CARD */}
            <section className={styles.summaryCard}>
                <div className={styles.summaryInfo}>
                    <label>Total Earnings</label>
                    <h2>${totalGain.toLocaleString()}</h2>
                </div>
                <div className={styles.filterGroup}>
                    {(['1m', '6m', '1y', 'all'] as FilterEnum[]).map((f) => (
                        <button
                            key={f}
                            className={filter === f ? styles.activeFilter : ''}
                            onClick={() => setFilter(f)}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
            </section>

            {/* PAYMENTS LIST */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Project</th>
                            <th>Amount</th>
                            <th>Currency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(p => {
                            const project = projects.find(proj => proj.id === p.projectId);
                            return (
                                <tr key={p.id}>
                                    <td>{new Date(p.date).toLocaleDateString('en-GB')}</td>
                                    <td><strong>{project?.title || 'Unknown'}</strong></td>
                                    <td className={styles.amount}>+ ${p.amount.toLocaleString()}</td>
                                    <td>{p.currency}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ADD PAYMENT MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Log New Payment</h3>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Project</label>
                                <select required value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        className={styles.amountInput}
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Save Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}