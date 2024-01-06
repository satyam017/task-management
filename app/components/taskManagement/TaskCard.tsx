// 'use client'
import React, { useEffect, useState } from 'react';
import { doc, updateDoc, deleteDoc, DocumentReference } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface TaskCardProps {
  title: string;
  taskId: string;
  onUpdateTask: (taskId: string, updatedTitle: string) => void;
  onDeleteTask: (taskId: string) => void; 
}

const TaskCard: React.FC<TaskCardProps> = ({ title, taskId, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedTitle(title);
  };

  const handleSaveEdit = async () => {
    try {
      const taskRef: DocumentReference = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        task: editedTitle,
      });

      onUpdateTask(taskId, editedTitle);

      setEditing(false);
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      onDeleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none text-black focus:border-blue-500"
          />
          <button className='text-blue-500' onClick={handleSaveEdit}>Save</button>
          <button className="text-red-500" onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-black">{title}</h2>
          <div className="flex justify-between">
            <div>
              <button className="text-blue-500" onClick={handleEdit}>
                Edit
              </button>
              <button className="text-red-500" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
