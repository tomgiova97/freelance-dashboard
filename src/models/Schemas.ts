import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  description: String,
  compensation: Number,
  compensationRate: { type: String, enum: ['daily', 'hourly', 'one-time', 'monthly', 'biweekly'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  cumulatedCompensation: { type: Number, default: 0 },
});

const TaskSchema = new Schema({
  projectId: { type: String, ref: 'Project', required: true },
  description: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  dueDate: Date,
});

const PaymentSchema = new Schema({
  projectId: { type: String, ref: 'Project', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  date: { type: Date, default: Date.now },
});

export const Project = models.Project || model('Project', ProjectSchema);
export const Task = models.Task || model('Task', TaskSchema);
export const Payment = models.Payment || model('Payment', PaymentSchema);