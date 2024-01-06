'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, startAfter, doc, DocumentSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuth } from '@/app/customHooks/useAuth';
import CreateTask from './createTask';
import Filter from './Filter';
import TaskCard from './TaskCard';
import withAuth from '../withAuth';
import Pagination from './Pagination';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
const Index = () => {
  const { user } = useAuth();
  interface Task {
    createdAt: null;
    id: string;
    task: string;
    description: string;
    status: string;
    onUpdateTask: (taskId: string, updatedTitle: string) => void;
  }
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Set your desired page size
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('userId');
  const fetchTasks = async () => {
    if (user) {
  
      const totalCount = await fetchTotalCount(); // Fetch total count
  
      let tasksQuery;
  
      if (search !== null) {
        // Fetch tasks for a specific user
        tasksQuery = query(collection(db, 'tasks'), where('userId', '==', search));
      } else {
        // Fetch normal tasks
        tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      }
  
      if (filteredStatus !== 'all') {
        tasksQuery = query(tasksQuery, where('status', '==', filteredStatus));
      }
  
      if (selectedDate) {
        tasksQuery = query(tasksQuery, where('createdAt', '==', new Date(selectedDate)));
      }
  
      if (selectedUser !== 'all') {
        tasksQuery = query(tasksQuery, where('assignedUser', '==', selectedUser));
      }
  
      // Pagination
      if (lastVisible) {
        tasksQuery = query(tasksQuery, orderBy('createdAt'), startAfter(lastVisible), limit(pageSize));
      } else {
        tasksQuery = query(tasksQuery, orderBy('createdAt'), limit(pageSize));
      }
  
      const tasksSnapshot = await getDocs(tasksQuery);
  
      const tasksData: Task[] = [];
      tasksSnapshot.forEach((doc) => {
        const taskData = doc.data();
        tasksData.push({ id: doc.id, ...taskData } as Task);
      });
  
  
      if (tasksData.length > 0) {
        setLastVisible(tasksData[tasksData.length - 1]?.createdAt || null);
      }
  
      setTasks(tasksData);
    }
  };

  const fetchTotalCount = async () => {
    if (user) {
      let totalCountQuery;

      if (search !== null) {
        // Fetch total count for a specific user
        totalCountQuery = query(collection(db, 'tasks'), where('userId', '==', search));
      } else {
        // Fetch total count for normal tasks
        totalCountQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      }

      if (filteredStatus !== 'all') {
        totalCountQuery = query(totalCountQuery, where('status', '==', filteredStatus));
      }

      if (selectedDate) {
        totalCountQuery = query(totalCountQuery, where('createdAt', '==', new Date(selectedDate)));
      }

      if (selectedUser !== 'all') {
        totalCountQuery = query(totalCountQuery, where('assignedUser', '==', selectedUser));
      }

      const totalCountSnapshot = await getDocs(totalCountQuery);

      return totalCountSnapshot.size; // Return the total count
    }

    return 0; 
  };
  useEffect(() => {
    const fetchData = async () => {
      const totalCount = await fetchTotalCount();
      setTotalItems(totalCount);
    };

    fetchData();
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, pageSize, filteredStatus, selectedDate]);

  const handleUpdateTask = async (taskId: string, updatedTitle: string) => {
    try {
      // Update the tasks array to reflect the changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, task: updatedTitle } : task
        )
      );
    } catch (error) {
      console.error('Error handling task update: ', error);
    }
  };
  const handleDeleteTask = (taskId: string) => {
    // Update the tasks array to exclude the deleted task
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };
  const handleAddTask = (newTask: Task) => {
    // Update the tasks array to include the newly added task
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white rounded shadow">
      <CreateTask  onAddTask={handleAddTask}/>
      <Filter
        onStatusChange={(status) => setFilteredStatus(status)}
        onDateChange={(date) => setSelectedDate(date)}
        onUserChange={(user) => setSelectedUser(user)}
        onApplyFilters={fetchTasks}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.task}
            taskId={task.id}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={totalItems} // Use totalItems state variable
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default withAuth(Index);
