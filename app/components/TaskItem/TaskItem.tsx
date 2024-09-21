"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import { edit, trash } from "@/app/utils/Icons";
import React, { useState } from "react";
import styled from "styled-components";
import formatDate from "@/app/utils/formatDate";

interface Props {
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  id: string;
}

function TaskItem({ title, description, date, isCompleted, id }: Props) {
  const { theme, deleteTask, updateTask } = useGlobalState();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title,
    description,
    date,
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedTask = { id, ...editedTask };
    updateTask(updatedTask);
    setIsEditing(false); // Exit editing mode after saving
  };

  return (
    <TaskItemStyled theme={theme}>
      {isEditing ? (
        // Editing Form
        <div className="edit-form">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleEditChange}
            placeholder="Task Title"
          />
          <input
            type="text"
            name="description"
            value={editedTask.description}
            onChange={handleEditChange}
            placeholder="Task Description"
          />
          <input
            type="date"
            name="date"
            value={editedTask.date}
            onChange={handleEditChange}
          />
          <div className="edit-buttons">
            <button className="save" onClick={handleSave}>
              Save
            </button>
            <button className="cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Normal View
        <>
          <h1>{editedTask.title}</h1>
          <p>{editedTask.description}</p>
          <p className="date">{formatDate(editedTask.date)}</p>
          <div className="task-footer">
            {isCompleted ? (
              <button
                className="completed"
                onClick={() => {
                  const task = {
                    id,
                    isCompleted: !isCompleted,
                  };
                  updateTask(task);
                }}
              >
                Completed
              </button>
            ) : (
              <button
                className="incomplete"
                onClick={() => {
                  const task = {
                    id,
                    isCompleted: !isCompleted,
                  };
                  updateTask(task);
                }}
              >
                Incomplete
              </button>
            )}
            <button className="edit" onClick={() => setIsEditing(true)}>
              {edit}
            </button>
            <button
              className="delete"
              onClick={() => {
                deleteTask(id);
              }}
            >
              {trash}
            </button>
          </div>
        </>
      )}
    </TaskItemStyled>
  );
}

const TaskItemStyled = styled.div`
  padding: 1.2rem 1rem;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.borderColor2};
  box-shadow: ${(props) => props.theme.shadow7};
  border: 2px solid ${(props) => props.theme.borderColor2};

  height: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .date {
    margin-top: auto;
  }

  > h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .task-footer {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    button {
      border: none;
      outline: none;
      cursor: pointer;

      i {
        font-size: 1.4rem;
        color: ${(props) => props.theme.colorGrey2};
      }
    }

    .edit {
      margin-left: auto;
    }

    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: ${(props) => props.theme.colorDanger};
      border-radius: 30px;
    }

    .completed {
      background: ${(props) => props.theme.colorGreenDark} !important;
    }
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    input {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid ${(props) => props.theme.borderColor};
      border-radius: 5px;
    }

    .edit-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;

      .save,
      .cancel {
        padding: 0.4rem 1rem;
        background-color: ${(props) => props.theme.colorGrey2};
        color: ${(props) => props.theme.colorPrimary};
        border-radius: 30px;
        cursor: pointer;
      }

      .save {
        background-color: ${(props) => props.theme.colorGreenDark};
        color: white;
      }

      .cancel {
        background-color: ${(props) => props.theme.colorDanger};
        color: white;
      }
    }
  }
`;

export default TaskItem;
