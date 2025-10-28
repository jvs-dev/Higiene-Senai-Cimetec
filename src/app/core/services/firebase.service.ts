import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Observable, from, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map, finalize } from 'rxjs/operators';

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
            return { id: doc.id, ...doc.data() };
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
            return { id: doc.id, ...doc.data() };
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
            const task = { id: docSnapshot.id, ...docSnapshot.data() };
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
}