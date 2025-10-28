import { Injectable } from '@angular/core';
import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: any;

  constructor() {
    // Initialize Firebase
    try {
      const app = getApp();
      this.db = getFirestore(app);
    } catch (e) {
      const app = initializeApp(environment.firebase);
      this.db = getFirestore(app);
    }
  }

  // Get all tasks from Firestore
  getTasks(): Observable<any[]> {
    const tasksCollection = collection(this.db, 'tasks');
    const tasksQuery = query(tasksCollection);
    return from(getDocs(tasksQuery).then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
    }));
  }

  // Get tasks filtered by status
  getTasksByStatus(status: string): Observable<any[]> {
    const tasksCollection = collection(this.db, 'tasks');
    const tasksQuery = query(tasksCollection, where('status', '==', status));
    return from(getDocs(tasksQuery).then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
    }));
  }

  // Update task status
  updateTaskStatus(taskId: string, status: string): Promise<void> {
    const taskDoc = doc(this.db, 'tasks', taskId);
    return updateDoc(taskDoc, { status });
  }

  // Get a single task by ID
  getTaskById(taskId: string): Observable<any> {
    const taskDoc = doc(this.db, 'tasks', taskId);
    return from(getDoc(taskDoc).then(docSnapshot => {
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        throw new Error('Task not found');
      }
    }));
  }
}