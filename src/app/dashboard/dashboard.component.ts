import { AuthService } from './../Services/auth';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonFab, IonFabButton, IonAvatar } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import {
  add, analyticsOutline, calendarClearOutline, calendarOutline,
  checkmarkCircleOutline, checkmarkSharp, closeOutline, grid,
  personOutline, searchOutline, settingsOutline, timeOutline, trashOutline, addOutline
} from 'ionicons/icons';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Images } from '../Services/images';

type TabKey = 'today' | 'upcoming' | 'completed' | 'all';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonContent, IonFab, IonFabButton, IonIcon, RouterLink, IonAvatar],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private db = inject(Firestore);
  private storage = inject(Storage);
  imaged = inject(Images)

  userProfileImage = signal<string | null>(null);
  private profileSub: any;

  //signal so computed() can track it
  searchQuery = signal('');
  onSearch(event: any) { this.searchQuery.set(event.target.value); }
  clearSearch() { this.searchQuery.set(''); }

  activeTab = signal<TabKey>('today');

  setTab(key: TabKey) {
    this.activeTab.set(key);
    this.searchQuery.set('');
  }

  tabs = [
    { key: 'today'     as TabKey, label: 'Today',     count: computed(() => this.todayTasks().length) },
    { key: 'upcoming'  as TabKey, label: 'Upcoming',  count: computed(() => this.upcomingTasks().length) },
    { key: 'completed' as TabKey, label: 'Completed', count: computed(() => this.completedTasks().length) },
    { key: 'all'       as TabKey, label: 'All',       count: computed(() => this.authService.tasks().length) },
  ];

  private todayStr = new Date().toDateString();

  todayTasks = computed(() =>
    this.authService.tasks().filter(t => {
      if (t.completed) return false;
      if (!t.deadline) return true;
      return new Date(t.deadline).toDateString() === this.todayStr;
    })
  );

  upcomingTasks = computed(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return this.authService.tasks().filter(t => {
      if (t.completed) return false;
      if (!t.deadline) return false;
      return new Date(t.deadline) > today;
    });
  });

  completedTasks = computed(() =>
    this.authService.tasks().filter(t => t.completed)
  );

  filteredTasks = computed(() => {
    const tab = this.activeTab();
    const q   = this.searchQuery().toLowerCase().trim();

    let base: any[];
    switch (tab) {
      case 'today':     base = this.todayTasks();     break;
      case 'upcoming':  base = this.upcomingTasks();  break;
      case 'completed': base = this.completedTasks(); break;
      default:          base = this.authService.tasks();
    }

    if (!q) return base;
    return base.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.priority?.toLowerCase().includes(q)
    );
  });

  sectionTitle = computed(() => {
    const q = this.searchQuery().trim();
    if (q) return `Results for "${q}"`;
    switch (this.activeTab()) {
      case 'today':     return "Today's Priority";
      case 'upcoming':  return 'Upcoming Tasks';
      case 'completed': return 'Completed Tasks';
      default:          return 'All Tasks';
    }
  });

  taskCountLabel = computed(() => {
    const tab   = this.activeTab();
    const count = this.filteredTasks().length;
    if (tab === 'today')     return `${count} task${count !== 1 ? 's' : ''} for today`;
    if (tab === 'upcoming')  return `${count} upcoming task${count !== 1 ? 's' : ''}`;
    if (tab === 'completed') return `${count} completed`;
    return `${count} total task${count !== 1 ? 's' : ''}`;
  });

  emptyIcon = computed(() => {
    if (this.searchQuery()) return 'search-outline';
    switch (this.activeTab()) {
      case 'completed': return 'checkmark-circle-outline';
      case 'upcoming':  return 'calendar-outline';
      default:          return 'clipboard-outline';
    }
  });

  emptyMessage = computed(() => {
    if (this.searchQuery()) return `No tasks match "${this.searchQuery()}"`;
    switch (this.activeTab()) {
      case 'today':     return "No tasks for today. Tap + to add one!";
      case 'upcoming':  return "Nothing upcoming. You're all caught up!";
      case 'completed': return "No completed tasks yet.";
      default:          return "No tasks yet. Tap + to get started!";
    }
  });

  formatDeadline(deadline: string | null | undefined): string {
    if (!deadline) return 'All Day';
    const d           = new Date(deadline);
    const todayStr    = new Date().toDateString();
    const tomorrowStr = new Date(Date.now() + 86400000).toDateString();
    const timeStr     = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (d.toDateString() === todayStr)    return `Today, ${timeStr}`;
    if (d.toDateString() === tomorrowStr) return `Tomorrow, ${timeStr}`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${timeStr}`;
  }

  async toggleTask(task: any) {
    await this.authService.updateTaskStatus(task.id, !task.completed);
  }

  async deleteTask(id: number) {
    await this.authService.deleteTask(id.toString());
  }

  constructor() {
    addIcons({
      add, addOutline, trashOutline, grid, calendarClearOutline, calendarOutline,
      analyticsOutline, personOutline, settingsOutline, searchOutline,
      checkmarkSharp, checkmarkCircleOutline, timeOutline, closeOutline
    });

    effect(async () => {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;

    await this.imaged.getUserData(uid);

    this.userProfileImage.set(this.imaged.dbUser?.dp || null);
  });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.profileSub?.unsubscribe();
  }
}