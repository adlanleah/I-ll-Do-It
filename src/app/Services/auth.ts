import { inject, Injectable, signal, effect, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, User } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, doc, Firestore, serverTimestamp, setDoc, updateDoc, onSnapshot, query, orderBy, Unsubscribe, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy{
  private auth = inject(Auth);
  private db = inject(Firestore);
  private router = inject(Router);

  // Signals
  public currentUser = signal<User | null>(null);
  public tasks = signal<any[]>([]); 
  public isLoadingEmail = signal(false);
  public isLoadingGoogle = signal(false);
  public authError = signal('');

  private unsubscribe?: Unsubscribe;

  constructor() {
    // Listen to Auth changes without RxJS
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
    });

    // syncing chanes
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.syncTasks(user.uid);
      } else {
        this.tasks.set([]);
      }
    });
  }

  // syncing 
  private syncTasks(uid: string) {
  if (this.unsubscribe) {
    this.unsubscribe();
    this.unsubscribe = undefined;
  }

  const q = query(
    collection(this.db, `users/${uid}/tasks`),
    // collection(this.db, 'tasks'),
    // where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );

  this.unsubscribe = onSnapshot(q, (snapshot) => {
    const taskList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    this.tasks.set(taskList);
  });
}

  // --- AUTH OPERATIONS ---
  async createUserByEmail(email: string, password: string, name: string) {
    this.isLoadingEmail.set(true);
    this.authError.set('');
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      if (cred.user) {
        await this.saveUser(cred.user.uid, email, name);
        this.router.navigate(['/dashboard']); 
      }
    } catch (error: any) {
      this.authError.set(error.code);
    } finally {
      this.isLoadingEmail.set(false);
    }
  }

  async createUserWithGoogle() {
    this.isLoadingGoogle.set(true);
    this.authError.set('');
    try {
      const authProvider = new GoogleAuthProvider();
      const cred = await signInWithPopup(this.auth, authProvider);
      if (cred.user) {
        await this.saveUser(cred.user.uid, cred.user.email!, cred.user.displayName!);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.authError.set(error.code);
    } finally {
      this.isLoadingGoogle.set(false);
    }
  }

  private async saveUser(uid: string, email: string, name: string) {
    const colRef = doc(this.db, `users/${uid}`);
    await setDoc(colRef, {
      email,
      uid,
      name,
      createdAt: serverTimestamp()
    }, {merge:true});
  }

  async loginWithEmail(email: string, pass: string) {
    this.isLoadingEmail.set(true);
    this.authError.set('');
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, pass);
      if (credential.user) {
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.authError.set(error.code);
    } finally {
      this.isLoadingEmail.set(false);
    }
  }

  async loginWithGoogle(){
     this.isLoadingGoogle.set(true);
    this.authError.set('');
    try {
      const authProvider = new GoogleAuthProvider;
    const cred = await signInWithPopup(this.auth, authProvider);
    if (cred.user) {
    this.router.navigate(['/dashboard'])
    }
    } catch (error: any) {
      this.authError.set(error.code)
    } finally{
      this.isLoadingGoogle.set(false)
    }
  }

  async logOut() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/']);
    } catch (error: any) {
      console.log(`${error}`);
    }
  }

  // crud ops
  async addTask(task: any) {
    const uid = this.currentUser()?.uid;
    if (!uid) return;

    const taskCol = collection(this.db, `users/${uid}/tasks`);
    return addDoc(taskCol, { 
      ...task, 
      completed: false, 
      createdAt: serverTimestamp(),
      userId: uid
    });
  }

  async deleteTask(taskId: string) {
    const uid = this.currentUser()?.uid;
    if (!uid) return;

    const docRef = doc(this.db, `users/${uid}/tasks/${taskId}`);
    return deleteDoc(docRef);
  }

  async updateTaskStatus(taskId: string, completed: boolean) {
    const uid = this.currentUser()?.uid;
    if (!uid) return;

    const docRef = doc(this.db, `users/${uid}/tasks/${taskId}`);
    return updateDoc(docRef, { completed });
  }

  ngOnDestroy(): void {
  this.unsubscribe?.();
  this.unsubscribe = undefined;
}
}