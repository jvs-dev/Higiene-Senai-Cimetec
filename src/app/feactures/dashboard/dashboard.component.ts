import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../core/services/firebase.service';
import { Observable } from 'rxjs';

interface Task {
  id: string;
  title: string;
  status: string;
  ra: string;
  location: string;
  dateTime: string;
  tags: string[];
  observation: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  activeFilter = 'Todas';
  tasks$: Observable<Task[]> | undefined;
  
  taskFilters = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Pendentes', value: 'Pendentes' },
    { label: 'Em Andamento', value: 'Em Andamento' },
    { label: 'Resolvidas', value: 'Resolvidas' }
  ];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadTasks();
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    this.loadTasks();
  }

  loadTasks() {
    if (this.activeFilter === 'Todas') {
      this.tasks$ = this.firebaseService.getTasks();
    } else {
      // Map filter values to status values
      let status = '';
      switch (this.activeFilter) {
        case 'Pendentes':
          status = 'Pendente';
          break;
        case 'Em Andamento':
          status = 'Em Andamento';
          break;
        case 'Resolvidas':
          status = 'Resolvida';
          break;
      }
      this.tasks$ = this.firebaseService.getTasksByStatus(status);
    }
  }

  updateTaskStatus(taskId: string) {
    // Determine the new status based on current status
    let newStatus = 'Resolvida'; // Default to resolved
    
    // In a real application, you would determine the next status based on business logic
    this.firebaseService.updateTaskStatus(taskId, newStatus).then(() => {
      console.log(`Task ${taskId} status updated to ${newStatus}`);
      // Reload tasks to reflect the change
      this.loadTasks();
    }).catch(error => {
      console.error('Error updating task status:', error);
      alert('Erro ao atualizar status da tarefa.');
    });
  }
}