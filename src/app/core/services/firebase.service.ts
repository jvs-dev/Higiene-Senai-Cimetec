import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import { Observable, from, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: any;

  constructor() {
    // Initialize Firebase
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);
  }

  // Get all tasks from Firestore
  getTasks(): Observable<any[]> {
    try {
      const tasksCollection = collection(this.db, 'tasks');
      const tasksQuery = query(tasksCollection);
      
      return from(getDocs(tasksQuery)).pipe(
        map(querySnapshot => {
          const tasks = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return this.mapFirebaseDataToTask(doc.id, data);
          });
          console.log('Fetched tasks:', tasks); // Debug log
          return tasks;
        }),
        catchError(error => {
          console.error('Error fetching tasks from Firestore:', error);
          return of([]); // Return empty array instead of throwing error
        })
      );
    } catch (error) {
      console.error('Error initializing tasks query:', error);
      return of([]); // Return empty array in case of initialization error
    }
  }

  // Get tasks filtered by status
  getTasksByStatus(status: string): Observable<any[]> {
    try {
      const tasksCollection = collection(this.db, 'tasks');
      const tasksQuery = query(tasksCollection, where('status', '==', status));
      
      return from(getDocs(tasksQuery)).pipe(
        map(querySnapshot => {
          const tasks = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return this.mapFirebaseDataToTask(doc.id, data);
          });
          console.log(`Fetched tasks with status ${status}:`, tasks); // Debug log
          return tasks;
        }),
        catchError(error => {
          console.error('Error fetching tasks by status from Firestore:', error);
          return of([]); // Return empty array instead of throwing error
        })
      );
    } catch (error) {
      console.error('Error initializing tasks by status query:', error);
      return of([]); // Return empty array in case of initialization error
    }
  }

  // Update task status
  updateTaskStatus(taskId: string, status: string): Promise<void> {
    try {
      const taskDoc = doc(this.db, 'tasks', taskId);
      return updateDoc(taskDoc, { status });
    } catch (error) {
      console.error('Error updating task status in Firestore:', error);
      return Promise.reject(new Error('Failed to update task status in Firestore'));
    }
  }

  // Get a single task by ID
  getTaskById(taskId: string): Observable<any> {
    try {
      const taskDoc = doc(this.db, 'tasks', taskId);
      return from(getDoc(taskDoc)).pipe(
        map(docSnapshot => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const task = this.mapFirebaseDataToTask(docSnapshot.id, data);
            console.log(`Fetched task with ID ${taskId}:`, task); // Debug log
            return task;
          } else {
            throw new Error('Task not found');
          }
        }),
        catchError(error => {
          console.error('Error fetching task by ID from Firestore:', error);
          throw error;
        })
      );
    } catch (error) {
      console.error('Error initializing task by ID query:', error);
      throw error;
    }
  }

  // Add a new task to Firestore
  addTask(taskData: any): Promise<any> {
    try {
      const tasksCollection = collection(this.db, 'tasks');
      const newTask = {
        userRa: taskData.userRa,
        andarPredio: taskData.andarPredio,
        banheiro: taskData.banheiro,
        problems: taskData.problems,
        status: 'Pendente', // Default status for new requests
        timestamp: new Date()
      };
      
      return addDoc(tasksCollection, newTask);
    } catch (error) {
      console.error('Error adding task to Firestore:', error);
      return Promise.reject(new Error('Failed to add task to Firestore'));
    }
  }

  // Send push notification to staff members
  async sendPushNotification(taskData: any): Promise<void> {
    try {
      // Prepare notification data
      const notificationData = {
        title: 'Nova Solicitação de Limpeza',
        body: `Nova solicitação em ${taskData.andarPredio}, banheiro ${taskData.banheiro}`,
        taskId: 'new-task', // This would be the actual task ID in a real implementation
        timestamp: new Date().toISOString(),
        data: {
          userRa: taskData.userRa,
          andarPredio: taskData.andarPredio,
          banheiro: taskData.banheiro,
          problems: taskData.problems
        }
      };

      // In a production environment, you would send this to your backend
      // which would then use the FCM Admin SDK to send the notification
      // For now, we'll simulate this by storing in localStorage
      const notifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
      notifications.push(notificationData);
      localStorage.setItem('pendingNotifications', JSON.stringify(notifications));
      
      console.log('Notification queued for sending:', notificationData);
      
      // Simulate sending to backend
      // In a real implementation, you would do something like:
      // await fetch('/api/send-notification', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + authToken
      //   },
      //   body: JSON.stringify(notificationData)
      // });
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Map Firebase data structure to our Task interface
  private mapFirebaseDataToTask(id: string, data: any): any {
    // Extract problems tags
    const tags: string[] = [];
    if (data.problems) {
      if (data.problems.papelHigienico) tags.push('Papel Higiênico');
      if (data.problems.papelToalha) tags.push('Papel Toalha');
      if (data.problems.sabonete) tags.push('Sabonete');
      if (data.problems.lixeira) tags.push('Lixeira');
      if (data.problems.banheiroSujo) tags.push('Banheiro Sujo');
      if (data.problems.outros) tags.push('Outros');
    }

    // Format timestamp
    let dateTime = 'Não informado';
    if (data.timestamp) {
      // Convert Firebase timestamp to readable format
      if (data.timestamp.toDate) {
        const date = data.timestamp.toDate();
        dateTime = date.toLocaleString('pt-BR');
      } else if (typeof data.timestamp === 'string') {
        dateTime = data.timestamp;
      }
    }

    return {
      id: id,
      title: 'Tarefa de Limpeza', // Default title
      status: data.status || 'Sem status',
      ra: data.userRa || 'Não informado',
      location: data.andarPredio && data.banheiro ? 
        `${data.andarPredio}, Banheiro ${data.banheiro}` : 
        (data.andarPredio || data.banheiro || 'Não informado'),
      dateTime: dateTime,
      tags: tags,
      observation: 'Nenhuma observação' // Default observation
    };
  }
}