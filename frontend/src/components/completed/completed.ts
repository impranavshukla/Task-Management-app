import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-completed',
  imports: [CommonModule],
  templateUrl: './completed.html',
  styleUrl: './completed.css'
})
export class Completed implements OnInit {
  // 1. Signal to hold our list of exclusively completed tasks!
  completedTasks = signal<TaskItem[]>([]);
  
  // URL to our backend API
  apiUrl = 'https://localhost:7043/api/task';

  // Inject HttpClient to communicate natively without manual services
  constructor(private http: HttpClient) {}

  // Automatically load when component mounts
  ngOnInit() {
    this.loadCompletedTasks();
  }

  // ==== Operations ====

  // Read: Fetch all tasks from the API and filter strictly for completed ones
  loadCompletedTasks() {
    this.http.get<TaskItem[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Filter out tasks perfectly directly here so we don't need a separate route
        const finishedOnly = data.filter(task => task.isCompleted === true);
        
        // Update our signal state!
        this.completedTasks.set(finishedOnly);
      },
      error: (err) => {
        console.error('Failed to load completed tasks', err);
      }
    });
  }

  // Delete: Remove a completed task permanently
  deleteTask(id: number) {
    if (!confirm('Are you sure you want to permanently delete this task?')) return;
    
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadCompletedTasks(), // Refresh list after wiping out
      error: (err) => console.error('Failed to permanently delete task', err)
    });
  }

  // Update: Mark a task as incomplete again (Moves it back to the main Dashboard list)
  markAsIncomplete(task: TaskItem) {
    // Flip the status back to false because they want to work on it again
    const updatedTask = { ...task, isCompleted: false };
    
    this.http.put(`${this.apiUrl}/${task.id}`, updatedTask).subscribe({
      next: () => this.loadCompletedTasks(), // Refresh list so it disappears entirely from this completed view
      error: (err) => console.error('Failed to revert status', err)
    });
  }
}
