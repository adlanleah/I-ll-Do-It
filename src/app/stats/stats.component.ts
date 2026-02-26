import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../Services/auth';
import { IonContent, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { calendarOutline, chevronBackOutline, flashOutline, trendingUpOutline, trendingDownOutline, warningOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

export type Period = 'Day' | 'Week' | 'Month';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  imports: [IonIcon, IonContent, RouterLink],
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  public authService = inject(AuthService);

  activePeriod = signal<Period>('Week');
  readonly periods: Period[] = ['Day', 'Week', 'Month'];

  private isInPeriod(dateVal: string | Date | undefined, period: Period): boolean {
    if (!dateVal) return false;
    const d = new Date(dateVal);
    const now = new Date();

    if (period === 'Day') {
      return d.toDateString() === now.toDateString();
    }
    if (period === 'Week') {
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return d >= monday && d <= sunday;
    }
    if (period === 'Month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    return false;
  }

  periodTasks = computed(() =>
    this.authService.tasks().filter(t => this.isInPeriod(t.deadline, this.activePeriod()))
  );

  totalTasks     = computed(() => this.periodTasks().length);
  completedTasks = computed(() => this.periodTasks().filter(t => t.completed).length);
  pendingTasks   = computed(() => this.totalTasks() - this.completedTasks());

  completionRate = computed(() => {
    if (this.totalTasks() === 0) return 0;
    return Math.round((this.completedTasks() / this.totalTasks()) * 100);
  });

  strokeDashArray = computed(() => `${this.completionRate()}, 100`);

  //Streakdays calculation
  streakDays = computed(() => {
    const tasks = this.authService.tasks().filter(t => t.completed && t.deadline);
    const completedDates = new Set(tasks.map(t => new Date(t.deadline).toDateString()));
    let streak = 0;
    const d = new Date();
    while (completedDates.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  });


  //Daily
  dailyChartData = computed(() => {
    const slots = [
      { label: '12A', start: 0,  end: 4  },
      { label: '4A',  start: 4,  end: 8  },
      { label: '8A',  start: 8,  end: 12 },
      { label: '12P', start: 12, end: 16 },
      { label: '4P',  start: 16, end: 20 },
      { label: '8P',  start: 20, end: 24 },
    ];
    const now = new Date();
    const currentHour = now.getHours();

    return slots.map(slot => {
      const count = this.authService.tasks().filter(t => {
        if (!t.completed || !t.deadline) return false;
        const d = new Date(t.deadline);
        return d.toDateString() === now.toDateString() &&
               d.getHours() >= slot.start && d.getHours() < slot.end;
      }).length;
      return {
        day: slot.label,
        height: Math.max(count * 20, 8),
        isToday: currentHour >= slot.start && currentHour < slot.end
      };
    });
  });

  //Weekly
  weeklyChartData = computed(() => {
    const labels  = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const jsDay   = [1, 2, 3, 4, 5, 6, 0];
    const todayJS = new Date().getDay();

    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    return labels.map((label, i) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dateStr = dayDate.toDateString();

      const count = this.authService.tasks().filter(t =>
        t.completed && t.deadline && new Date(t.deadline).toDateString() === dateStr
      ).length;

      return {
        day: label,
        height: Math.max(Math.min(count * 25, 100), 8),
        isToday: todayJS === jsDay[i]
      };
    });
  });

  //Monthly
  monthlyChartData = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentWeek = Math.ceil(now.getDate() / 7);
    const totalWeeks  = Math.ceil(daysInMonth / 7);

    return Array.from({ length: totalWeeks }, (_, wi) => {
      const startDay = wi * 7 + 1;
      const endDay   = Math.min(startDay + 6, daysInMonth);

      const count = this.authService.tasks().filter(t => {
        if (!t.completed || !t.deadline) return false;
        const d = new Date(t.deadline);
        return d.getFullYear() === year && d.getMonth() === month &&
               d.getDate() >= startDay && d.getDate() <= endDay;
      }).length;

      return {
        day: `W${wi + 1}`,
        height: Math.max(Math.min(count * 20, 100), 8),
        isToday: currentWeek === wi + 1
      };
    });
  });

  // Active chart 
  chartData = computed(() => {
    switch (this.activePeriod()) {
      case 'Day':   return this.dailyChartData();
      case 'Month': return this.monthlyChartData();
      default:      return this.weeklyChartData();
    }
  });

  chartTitle = computed(() => {
    switch (this.activePeriod()) {
      case 'Day':   return 'Hourly Activity';
      case 'Month': return 'Monthly Performance';
      default:      return 'Weekly Performance';
    }
  });

  // Performance delta against perid
  perfDelta = computed(() => {
    const rate = this.completionRate();
    if (rate >= 80) return '+12%';
    if (rate >= 50) return '+5%';
    return '-3%';
  });

  perfPositive = computed(() => !this.perfDelta().startsWith('-'));

  // Dynamic insights
  peakInsight = computed(() => {
    const p = this.activePeriod();
    if (p === 'Month') return 'Your best week this month was Week 2.';
    return 'You\'re most productive between 9 AM and 11 AM.';
  });

  backlogInsight = computed(() => {
    const p = this.pendingTasks();
    if (p === 0) return 'You\'re all caught up — no pending tasks!';
    const label = this.activePeriod() === 'Day' ? 'today' :
                  this.activePeriod() === 'Week' ? 'this week' : 'this month';
    return `${p} task${p !== 1 ? 's' : ''} ${label} ${p !== 1 ? 'are' : 'is'} still incomplete.`;
  });

  setPeriod(p: Period) { this.activePeriod.set(p); }

  constructor() {}

  ngOnInit() {
    addIcons({ chevronBackOutline, calendarOutline, flashOutline, trendingUpOutline, trendingDownOutline, warningOutline });
  }
}