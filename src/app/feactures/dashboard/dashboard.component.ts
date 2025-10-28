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

interface TaskStats {
  pending: number;
  inProgress: number;
  resolved: number;
  total: number;
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
  stats: TaskStats = { pending: 0, inProgress: 0, resolved: 0, total: 0 };
  error: string | null = null;
  
  taskFilters = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Pendentes', value: 'Pendentes' },
    { label: 'Em Andamento', value: 'Em Andamento' },
    { label: 'Resolvidas', value: 'Resolvidas' }
  ];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadTasks();
    this.loadStats();
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    this.loadTasks();
  }

  loadTasks() {
    this.error = null;
    
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

  loadStats() {
    // Fetch all tasks and calculate stats
    this.firebaseService.getTasks().subscribe(
      tasks => {
        let pending = 0;
        let inProgress = 0;
        let resolved = 0;
        
        tasks.forEach(task => {
          switch (task.status) {
            case 'Pendente':
              pending++;
              break;
            case 'Em Andamento':
              inProgress++;
              break;
            case 'Resolvida':
              resolved++;
              break;
          }
        });
        
        this.stats = {
          pending: pending,
          inProgress: inProgress,
          resolved: resolved,
          total: tasks.length
        };
      },
      error => {
        console.error('Error loading stats:', error);
        this.error = 'Erro ao carregar estatísticas.';
      }
    );
  }

  refreshTasks() {
    this.loadTasks();
    this.loadStats();
  }

  updateTaskStatus(taskId: string, event: any) {
    const newStatus = event.target.value;
    
    this.firebaseService.updateTaskStatus(taskId, newStatus).then(() => {
      console.log(`Task ${taskId} status updated to ${newStatus}`);
      // Show success message
      alert('Status da tarefa atualizado com sucesso!');
      // Reload tasks and stats to reflect the change
      this.loadTasks();
      this.loadStats();
    }).catch(error => {
      console.error('Error updating task status:', error);
      this.error = 'Erro ao atualizar status da tarefa.';
      alert('Erro ao atualizar status da tarefa.');
    });
  }
}