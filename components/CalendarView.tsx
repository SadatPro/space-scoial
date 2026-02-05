import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  X, 
  MapPin, 
  CheckCircle2, 
  Filter,
  MoreVertical,
  ChevronDown,
  ListTodo,
  Activity,
  CalendarDays,
  Circle,
  CheckCircle,
  Star,
  Zap,
  BookOpen,
  Code,
  Flame,
  Info,
  BarChart3,
  TrendingUp,
  Target,
  BrainCircuit,
  History,
  Clock,
  ArrowRight,
  Heart,
  Dumbbell,
  Coffee,
  Moon
} from 'lucide-react';
import { CalendarEvent, Todo, Habit } from '../types';
import { MOCK_TODOS, MOCK_HABITS } from '../services/mockData';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plannerTab, setPlannerTab] = useState<'schedule' | 'tasks' | 'habits' | 'analytics'>('schedule');
  
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  
  const [eventForm, setEventForm] = useState({ title: '', description: '', time: '', endTime: '', category: 'Meeting' as const });
  const [todoForm, setTodoForm] = useState({ text: '', category: 'Work' as const, startTime: '', endTime: '' });
  const [habitForm, setHabitForm] = useState({ name: '', icon: 'Activity', color: 'teal' });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const getDateStr = (date: Date) => date.toISOString().split('T')[0];

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const selectedDayEvents = useMemo(() => {
    return events.filter(e => e.date === getDateStr(selectedDate)).sort((a,b) => a.time.localeCompare(b.time));
  }, [events, selectedDate]);

  const selectedDayTodos = useMemo(() => {
    return todos.filter(t => t.date === getDateStr(selectedDate));
  }, [todos, selectedDate]);

  const generateHeatMap = (activityType: 'tasks' | 'habits') => {
    const result = [];
    const today = new Date();
    for (let i = 41; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = getDateStr(d);
      let count = 0;
      if (activityType === 'tasks') {
        count = todos.filter(t => t.date === dateStr && t.completed).length;
      } else {
        count = habits.filter(h => h.completedDates.includes(dateStr)).length;
      }
      result.push({ date: d, count, dateStr });
    }
    return result;
  };

  const taskHeatMap = useMemo(() => generateHeatMap('tasks'), [todos]);
  const habitHeatMap = useMemo(() => generateHeatMap('habits'), [habits]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventForm.title,
      date: getDateStr(selectedDate),
      time: eventForm.time,
      endTime: eventForm.endTime,
      description: eventForm.description,
      category: eventForm.category
    };
    onAddEvent(newEvent);
    setIsAddingEvent(false);
    setEventForm({ title: '', description: '', time: '', endTime: '', category: 'Meeting' });
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: todoForm.text,
      completed: false,
      category: todoForm.category,
      date: getDateStr(selectedDate),
      startTime: todoForm.startTime,
      endTime: todoForm.endTime
    };
    setTodos([...todos, newTodo]);
    setIsAddingTodo(false);
    setTodoForm({ text: '', category: 'Work', startTime: '', endTime: '' });
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitForm.name,
      icon: habitForm.icon,
      completedDates: [],
      streak: 0,
      color: habitForm.color
    };
    setHabits([...habits, newHabit]);
    setIsAddingHabit(false);
    setHabitForm({ name: '', icon: 'Activity', color: 'teal' });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleHabit = (habitId: string) => {
    const dateStr = getDateStr(selectedDate);
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.completedDates.includes(dateStr);
        return {
          ...h,
          completedDates: isCompleted 
            ? h.completedDates.filter(d => d !== dateStr) 
            : [...h.completedDates, dateStr],
          streak: isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1
        };
      }
      return h;
    }));
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const categoryStyles = {
    Meeting: { bg: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
    Reminder: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    Personal: { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    Event: { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    Social: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    Workshop: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    Travel: { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
    Work: { bg: 'bg-slate-900', light: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' },
    Health: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    Urgent: { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    'Deep Work': { bg: 'bg-blue-700', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    Learning: { bg: 'bg-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100' },
    Hobby: { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100' },
    Errands: { bg: 'bg-stone-500', light: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-100' }
  };

  const getHeatMapColor = (count: number, type: 'tasks' | 'habits') => {
    if (count === 0) return 'bg-slate-100';
    const base = type === 'tasks' ? 'teal' : 'amber';
    if (count === 1) return `bg-${base}-200`;
    if (count === 2) return `bg-${base}-400`;
    if (count >= 3) return `bg-${base}-600`;
    return 'bg-slate-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            Space Planner
          </h1>
          <p className="text-slate-500 font-medium">Simplify your workflow, habits, and agenda.</p>
        </div>
        <div className="flex items-center space-x-3">
          {(plannerTab === 'schedule' || plannerTab === 'tasks' || plannerTab === 'habits') && (
            <button 
              onClick={() => {
                if (plannerTab === 'schedule') setIsAddingEvent(true);
                else if (plannerTab === 'tasks') setIsAddingTodo(true);
                else setIsAddingHabit(true);
              }}
              className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:bg-teal-600 transition-all hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Mini Calendar Selector */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <div className="flex items-center space-x-1">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">{d}</div>)}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={idx} className="h-10" />;
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isSelected = isSameDay(dayDate, selectedDate);
                const isToday = isSameDay(dayDate, new Date());
                const dayEvents = getEventsForDay(day);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`h-10 w-full rounded-xl flex flex-col items-center justify-center relative transition-all ${
                      isSelected ? 'bg-slate-900 text-white shadow-lg' : isToday ? 'bg-teal-50 text-teal-600 font-bold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold">{day}</span>
                    {dayEvents.length > 0 && !isSelected && (
                      <div className="flex space-x-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map(e => (
                          <div key={e.id} className={`w-1 h-1 rounded-full ${categoryStyles[e.category]?.bg || 'bg-slate-400'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
             <h3 className="text-lg font-bold mb-4 relative z-10">Daily Progress</h3>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                   <span className="text-xs text-white/60">Completion Rate</span>
                   <span className="text-xs font-bold">75%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[75%] h-full bg-teal-400"></div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Tracking {habits.length} Active Habits</span>
                </div>
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Week Overview</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <div className="text-[10px] font-black text-slate-400 uppercase">Tasks</div>
                   <div className="text-xl font-black text-slate-900">{todos.filter(t => t.completed).length}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <div className="text-[10px] font-black text-slate-400 uppercase">Streak</div>
                   <div className="text-xl font-black text-amber-500">{Math.max(...habits.map(h => h.streak), 0)}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Planner Tabs & Content */}
        <div className="lg:col-span-8">
           {/* Tab Navigation */}
           <div className="flex items-center space-x-2 mb-8 bg-slate-100/50 p-1.5 rounded-[1.5rem] w-fit">
              <button 
                onClick={() => setPlannerTab('schedule')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${plannerTab === 'schedule' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              <button 
                onClick={() => setPlannerTab('tasks')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${plannerTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tasks</span>
              </button>
              <button 
                onClick={() => setPlannerTab('habits')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${plannerTab === 'habits' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Activity className="w-4 h-4" />
                <span>Habits</span>
              </button>
              <button 
                onClick={() => setPlannerTab('analytics')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${plannerTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
           </div>

           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* SCHEDULE TAB */}
              {plannerTab === 'schedule' && (
                <div className="space-y-4">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start space-x-6">
                          <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 ${categoryStyles[event.category]?.light || 'bg-slate-50'} ${categoryStyles[event.category]?.text || 'text-slate-600'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{event.time}</span>
                            <div className="h-px w-4 bg-current opacity-30 my-1"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{event.endTime || '--:--'}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                              <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${categoryStyles[event.category]?.text || 'text-slate-600'} ${categoryStyles[event.category]?.border || 'border-slate-100'} bg-white`}>
                                {event.category}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">{event.description || 'No description provided.'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => onDeleteEvent(event.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                      <CalendarIcon className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold text-lg">Empty Agenda</p>
                    </div>
                  )}
                </div>
              )}

              {/* TASKS TAB */}
              {plannerTab === 'tasks' && (
                <div className="space-y-6">
                  {/* Task Activity Heat Map */}
                  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-teal-600" />
                        <h3 className="text-lg font-black text-slate-900">Task Activity</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 justify-center">
                       {taskHeatMap.map((d, i) => {
                         const isCurrent = isSameDay(d.date, selectedDate);
                         return (
                           <button
                             key={i}
                             onClick={() => setSelectedDate(d.date)}
                             className={`w-6 h-6 rounded-md transition-all relative group ${getHeatMapColor(d.count, 'tasks')} ${isCurrent ? 'ring-2 ring-teal-500 ring-offset-2' : ''}`}
                             title={`${d.dateStr}: ${d.count} tasks completed`}
                           >
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {d.dateStr}: {d.count} tasks
                             </div>
                           </button>
                         )
                       })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedDayTodos.length > 0 ? (
                      selectedDayTodos.map(todo => (
                        <div 
                          key={todo.id}
                          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => toggleTodo(todo.id)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${todo.completed ? 'bg-teal-500 text-white' : 'bg-slate-50 text-slate-200 hover:bg-teal-50'}`}
                            >
                              {todo.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </button>
                            <div>
                              <p className={`font-bold text-lg transition-all ${todo.completed ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
                                {todo.text}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${categoryStyles[todo.category]?.light || 'bg-slate-50'} ${categoryStyles[todo.category]?.text || 'text-slate-400'} border ${categoryStyles[todo.category]?.border || 'border-slate-100'}`}>
                                  {todo.category}
                                </span>
                                {(todo.startTime || todo.endTime) && (
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center ml-2">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {todo.startTime || '--:--'} <ArrowRight className="w-2 h-2 mx-1" /> {todo.endTime || '--:--'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteTodo(todo.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-24 text-center bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                        <ListTodo className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-lg">No tasks for today.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HABITS TAB */}
              {plannerTab === 'habits' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-black text-slate-900">Habit Consistency</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 justify-center">
                       {habitHeatMap.map((d, i) => {
                         const isCurrent = isSameDay(d.date, selectedDate);
                         return (
                           <button
                             key={i}
                             onClick={() => setSelectedDate(d.date)}
                             className={`w-6 h-6 rounded-md transition-all relative group ${getHeatMapColor(d.count, 'habits')} ${isCurrent ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
                             title={`${d.dateStr}: ${d.count} habits done`}
                           >
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {d.dateStr}: {d.count} habits
                             </div>
                           </button>
                         )
                       })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {habits.map(habit => {
                      const isCompleted = habit.completedDates.includes(getDateStr(selectedDate));
                      const last14Days = Array.from({length: 14}).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (13 - i));
                        return habit.completedDates.includes(getDateStr(d));
                      });

                      return (
                        <div key={habit.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCompleted ? 'bg-teal-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                {getHabitIcon(habit.icon)}
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                <span className="text-xs font-black text-slate-900">{habit.streak} day streak</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">{habit.name}</h3>
                            
                            <div className="flex space-x-1 mb-6">
                               {last14Days.map((done, i) => (
                                 <div key={i} className={`w-2 h-2 rounded-full ${done ? 'bg-teal-500' : 'bg-slate-100'}`} />
                               ))}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 ${
                              isCompleted 
                              ? 'bg-teal-50 text-teal-600 border border-teal-100' 
                              : 'bg-slate-900 text-white shadow-lg hover:bg-teal-600'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            <span>{isCompleted ? 'Done for Today' : 'Mark Complete'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ANALYTICS TAB */}
              {plannerTab === 'analytics' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                         <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900 flex items-center">
                               <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
                               Focus Trends
                            </h3>
                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">WEEKLY DATA</div>
                         </div>
                         <div className="flex items-end justify-between h-40 px-4">
                            {[40, 60, 45, 90, 65, 30, 50].map((h, i) => (
                               <div key={i} className="flex flex-col items-center group w-full">
                                  <div className={`w-8 bg-teal-500 rounded-t-lg transition-all duration-500 group-hover:bg-teal-600 group-hover:scale-110`} style={{ height: `${h}%` }}></div>
                                  <span className="text-[10px] font-bold text-slate-300 mt-2">{'SMTWTFS'[i]}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                         <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900 flex items-center">
                               <Target className="w-5 h-5 mr-2 text-amber-500" />
                               Habit Mastery
                            </h3>
                         </div>
                         <div className="space-y-6">
                            {habits.map(h => {
                                const rate = Math.min(100, (h.streak / 30) * 100);
                                return (
                                    <div key={h.id}>
                                       <div className="flex justify-between text-xs font-bold mb-2">
                                          <span className="text-slate-700">{h.name}</span>
                                          <span className="text-slate-400">{rate.toFixed(0)}% to Goal</span>
                                       </div>
                                       <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                          <div className={`h-full bg-amber-400 transition-all duration-1000`} style={{ width: `${rate}%` }}></div>
                                       </div>
                                    </div>
                                );
                            })}
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10">
                         <BrainCircuit className="w-24 h-24 text-teal-500/20" />
                      </div>
                      <div className="relative z-10">
                         <div className="flex items-center space-x-3 mb-4">
                            <Zap className="w-5 h-5 text-teal-400 fill-teal-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-teal-400">Space AI Productivity Audit</span>
                         </div>
                         <h3 className="text-3xl font-black mb-4">You're hitting peak focus early!</h3>
                         <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-8">
                            Based on your activity patterns, you complete 40% of your tasks between 9 AM and 11 AM. Tuesday is your strongest habit day. Try moving your most difficult work to Tuesday mornings.
                         </p>
                         <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-teal-50 transition-all flex items-center space-x-2">
                            <History className="w-4 h-4" />
                            <span>View Monthly Report</span>
                         </button>
                      </div>
                   </div>
                </div>
              )}

           </div>
        </div>
      </div>

      {isAddingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingEvent(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300 border border-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Add Event</h3>
              <button onClick={() => setIsAddingEvent(false)} className="p-2 hover:bg-gray-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-6">
               <input 
                  required 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                  placeholder="Event Title..."
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                />
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Time</label>
                    <input 
                      required 
                      type="time" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                      value={eventForm.time}
                      onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">End Time</label>
                    <input 
                      required 
                      type="time" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                      value={eventForm.endTime}
                      onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })}
                    />
                  </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                 <select 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                    value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value as any })}
                  >
                    <option>Meeting</option>
                    <option>Reminder</option>
                    <option>Personal</option>
                    <option>Event</option>
                    <option>Social</option>
                    <option>Workshop</option>
                    <option>Travel</option>
                  </select>
               </div>
               <textarea 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-600 h-28 resize-none"
                  placeholder="Notes..."
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                />
               <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all">
                  Confirm Event
               </button>
            </form>
          </div>
        </div>
      )}

      {isAddingTodo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingTodo(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300 border border-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">New Task</h3>
              <button onClick={() => setIsAddingTodo(false)} className="p-2 hover:bg-gray-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddTodo} className="space-y-6">
               <input 
                  required 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                  placeholder="Task Description..."
                  value={todoForm.text}
                  onChange={e => setTodoForm({ ...todoForm, text: e.target.value })}
                />
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Time</label>
                    <input 
                      type="time" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                      value={todoForm.startTime}
                      onChange={e => setTodoForm({ ...todoForm, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">End Time</label>
                    <input 
                      type="time" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                      value={todoForm.endTime}
                      onChange={e => setTodoForm({ ...todoForm, endTime: e.target.value })}
                    />
                  </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Task Category</label>
                 <select 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                    value={todoForm.category}
                    onChange={e => setTodoForm({ ...todoForm, category: e.target.value as any })}
                  >
                    <option>Work</option>
                    <option>Deep Work</option>
                    <option>Learning</option>
                    <option>Health</option>
                    <option>Hobby</option>
                    <option>Errands</option>
                    <option>Personal</option>
                    <option>Urgent</option>
                 </select>
               </div>
               <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all">
                  Add to List
               </button>
            </form>
          </div>
        </div>
      )}

      {isAddingHabit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingHabit(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300 border border-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Track Habit</h3>
              <button onClick={() => setIsAddingHabit(false)} className="p-2 hover:bg-gray-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddHabit} className="space-y-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Habit Name</label>
                 <input 
                    required 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800"
                    placeholder="e.g. Read for 30 mins"
                    value={habitForm.name}
                    onChange={e => setHabitForm({ ...habitForm, name: e.target.value })}
                  />
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Choose Icon</label>
                 <div className="grid grid-cols-4 gap-2">
                    {['Activity', 'Zap', 'BookOpen', 'Code', 'Heart', 'Dumbbell', 'Coffee', 'Moon'].map(iconName => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setHabitForm({ ...habitForm, icon: iconName })}
                        className={`p-4 rounded-xl flex items-center justify-center transition-all ${habitForm.icon === iconName ? 'bg-slate-900 text-teal-400 shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {getHabitIcon(iconName)}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Color Theme</label>
                 <div className="flex space-x-2">
                    {['teal', 'amber', 'indigo', 'rose', 'emerald'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setHabitForm({ ...habitForm, color: c })}
                        className={`w-10 h-10 rounded-full transition-all border-4 ${habitForm.color === c ? 'border-slate-900' : 'border-transparent'} ${
                          c === 'teal' ? 'bg-teal-500' : 
                          c === 'amber' ? 'bg-amber-500' : 
                          c === 'indigo' ? 'bg-indigo-500' : 
                          c === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    ))}
                 </div>
               </div>

               <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all">
                  Start Tracking
               </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};