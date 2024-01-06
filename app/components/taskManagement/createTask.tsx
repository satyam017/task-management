// 'use client'
import { useState, FormEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';

interface CreateTaskProps {
  onAddTask: (newTask: any) => void; // Add this line
}

const CreateTask: React.FC<CreateTaskProps> = ({ onAddTask }) => {
  const [taskInput, setTaskInput] = useState('');

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Get the current user
      const user = auth.currentUser;

      if (user) {
        // Add the task to Firestore
        const taskRef = await addDoc(collection(db, 'tasks'), {
          userId: user.uid,
          task: taskInput,
          createdAt: new Date(),
        });

        const newTask = { id: taskRef.id, task: taskInput, createdAt: new Date() };
        onAddTask(newTask); // Notify the parent component about the new task

        // Clear the input field after adding the task
        setTaskInput('');
      } else {
        console.error('User not logged in.');
      }
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  return (
    <div>
      <form id="taskForm" className="mb-4" onSubmit={handleAddTask}>
        <label className="block text-gray-700 text-sm font-bold mb-2">New Task:</label>
        <input
          type="text"
          id="taskInput"
          name="taskInput"
          className="w-full px-4 py-2 border rounded focus:outline-none text-black focus:border-blue-500"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
