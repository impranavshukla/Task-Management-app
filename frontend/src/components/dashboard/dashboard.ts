import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: string;
  createdAt: Date | string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  // 1. Define a Signal to hold the list of tasks. Signals update the UI automatically when changed!
  tasks = signal<TaskItem[]>([]);
  
  // 2. Define standard properties for our Form
  newTask: Partial<TaskItem> = {
    title: '',
    description: '',
    priority: 'Medium'
  };

  isEditing: boolean = false;
  editingTaskId: number | null = null;
  isModalOpen: boolean = false;
  
  // URL to our backend API
  apiUrl = 'https://localhost:7043/api/task';

  // Inject HttpClient to make API requests easily
  constructor(private http: HttpClient) {}

  // Automatically load tasks when the dashboard opens
  ngOnInit() {
    this.loadTasks();
  }

  // ==== CRUD Operations ====

  // Read: Fetch all tasks from the API
  loadTasks() {
    this.http.get<TaskItem[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Here we update the signal. The "set()" command tells Angular the data changed.
        this.tasks.set(data);
      },
      error: (err) => {
        console.error('Failed to load tasks. Check if backend is running!', err);
      }
    });
  }

  // Create or Update: Save a task from the form
  saveTask() {
    if (!this.newTask.title) return;

    if (this.isEditing && this.editingTaskId !== null) {
      const currentTask = this.tasks().find(t => t.id === this.editingTaskId);
      if (!currentTask) return;

      const updatedTask = { ...currentTask, ...this.newTask };
      this.http.put(`${this.apiUrl}/${this.editingTaskId}`, updatedTask).subscribe({
        next: () => {
          this.loadTasks(); 
          this.closeModal(); 
        },
        error: (err) => console.error('Failed to update task', err)
      });
    } else {
      const taskToCreate = {
        title: this.newTask.title,
        description: this.newTask.description || '',
        priority: this.newTask.priority || 'Medium',
        isCompleted: false,
        createdAt: new Date().toISOString()
      };

      this.http.post<TaskItem>(this.apiUrl, taskToCreate).subscribe({
        next: () => {
          this.loadTasks(); 
          this.closeModal();
        },
        error: (err) => console.error('Failed to create task', err)
      });
    }
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  toggleComplete(task: TaskItem) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    this.http.put(`${this.apiUrl}/${task.id}`, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to toggle status', err)
    });
  }

  // ==== Modal & Form Helper Methods ====

  openAddModal() {
    this.isEditing = false;
    this.editingTaskId = null;
    this.newTask = { title: '', description: '', priority: 'Medium' };
    this.isModalOpen = true;
  }

  editTask(task: TaskItem) {
    this.isEditing = true;
    this.editingTaskId = task.id;
    this.newTask = {
      title: task.title,
      description: task.description,
      priority: task.priority
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingTaskId = null;
    this.newTask = { title: '', description: '', priority: 'Medium' };
  }
}

