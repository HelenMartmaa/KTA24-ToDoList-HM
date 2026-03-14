import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
    // Inject Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Inject global styles
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #0a0a0a;
        background-image:
          radial-gradient(ellipse at 20% 20%, rgba(0,255,100,0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(0,200,255,0.04) 0%, transparent 60%);
        min-height: 100vh;
      }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 8px rgba(0,255,100,0.4); }
        50% { box-shadow: 0 0 18px rgba(0,255,100,0.8); }
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      .task-item {
        animation: fadeSlideIn 0.25s ease forwards;
      }
      .add-btn:hover {
        background: #00ff64 !important;
        color: #0a0a0a !important;
        box-shadow: 0 0 20px rgba(0,255,100,0.6) !important;
        transform: translateY(-1px);
      }
      .delete-btn:hover {
        background: rgba(255,60,60,0.25) !important;
        border-color: #ff3c3c !important;
        color: #ff3c3c !important;
      }
      .task-row:hover {
        border-color: rgba(0,255,100,0.4) !important;
        background: rgba(0,255,100,0.04) !important;
      }
      input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #00ff64;
        border-radius: 3px;
        background: transparent;
        cursor: pointer;
        position: relative;
        flex-shrink: 0;
        transition: all 0.2s;
      }
      input[type="checkbox"]:checked {
        background: #00ff64;
        box-shadow: 0 0 8px rgba(0,255,100,0.6);
      }
      input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 2px;
        font-size: 13px;
        color: #0a0a0a;
        font-weight: bold;
      }
      input[type="text"]::placeholder { color: #3a4a3a; }
      input[type="text"]:focus { outline: none; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #111; }
      ::-webkit-scrollbar-thumb { background: #00ff64; border-radius: 2px; }
    `;
    document.head.appendChild(style);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;
    try {
      await axios.post('/api/tasks', { task: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleCompleted = async (task) => {
    try {
      const newCompleted = task.completed == 1 ? false : true;
      await axios.put(`/api/tasks/${task.id}`, { completed: newCompleted });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const pendingTasks = tasks.filter(task => task.completed == 0);
  const completedTasks = tasks.filter(task => task.completed == 1);

  const renderTask = (task, showDelete = false) => (
    <li
      key={task.id}
      className="task-item task-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        marginBottom: '8px',
        background: task.completed == 1 ? 'rgba(0,255,100,0.03)' : 'rgba(255,255,255,0.03)',
        border: task.completed == 1
          ? '1px solid rgba(0,255,100,0.15)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px',
        transition: 'all 0.2s',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <input
          type="checkbox"
          checked={task.completed == 1}
          onChange={() => toggleCompleted(task)}
        />
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.9rem',
          color: task.completed == 1 ? '#3a6a3a' : '#c8e6c8',
          letterSpacing: '0.02em',
          transition: 'color 0.3s',
        }}>
          {task.completed == 1 && (
            <span style={{ color: '#00ff64', marginRight: '6px', fontSize: '0.75rem' }}>[DONE]</span>
          )}
          {task.task}
        </span>
      </div>
      {showDelete && (
        <button
          className="delete-btn"
          onClick={() => deleteTask(task.id)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,60,60,0.3)',
            color: 'rgba(255,60,60,0.6)',
            padding: '3px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            transition: 'all 0.2s',
            marginLeft: '12px',
            flexShrink: 0,
          }}
        >
          DEL
        </button>
      )}
    </li>
  );

  const completionPct = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div style={{
      maxWidth: '860px',
      margin: '0 auto',
      padding: '48px 24px',
      fontFamily: "'Rajdhani', sans-serif",
    }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '6px',
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '700',
            color: '#e8f5e8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            TO-DO LIST
          </h1>
        </div>
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, #00ff64, transparent)',
          marginTop: '12px',
          width: '100%',
        }} />
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.7rem',
              color: '#3a6a3a',
              letterSpacing: '0.1em',
            }}>PROGRESS</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.7rem',
              color: '#00ff64',
              letterSpacing: '0.1em',
            }}>{completionPct}%</span>
          </div>
          <div style={{
            height: '4px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${completionPct}%`,
              background: 'linear-gradient(90deg, #00cc50, #00ff64)',
              boxShadow: '0 0 8px rgba(0,255,100,0.5)',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,255,100,0.04)',
          border: '1px solid rgba(0,255,100,0.25)',
          borderRadius: '4px',
          padding: '0 14px',
        }}>
          <span style={{
            fontFamily: 'Arial, sans-serif',
            color: '#00ff64',
            fontSize: '0.85rem',
            marginRight: '10px',
            opacity: 0.6,
          }}>›</span>
          <input
            type="text"
            value={newTask || ''}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add new entry..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#c8e6c8',
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.9rem',
              padding: '12px 0',
              letterSpacing: '0.03em',
            }}
          />
        </div>
        <button
          className="add-btn"
          onClick={addTask}
          style={{
            padding: '12px 24px',
            background: 'rgba(0,255,100,0.1)',
            color: '#00ff64',
            border: '1px solid rgba(0,255,100,0.4)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: '700',
            fontSize: '0.9rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            animation: 'pulse 2.5s infinite',
          }}
        >
          + ADD
        </button>
      </div>

      {/* Main list */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '0.7rem',
            color: '#3a5a3a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>ALL TASKS</span>
          <span style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '0.7rem',
            color: '#00ff64',
            background: 'rgba(0,255,100,0.1)',
            border: '1px solid rgba(0,255,100,0.2)',
            padding: '1px 8px',
            borderRadius: '10px',
          }}>{tasks.length}</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.length === 0 ? (
            <li style={{
              fontFamily: 'Arial, sans-serif',
              color: '#2a3a2a',
              fontSize: '0.85rem',
              padding: '12px 0',
              letterSpacing: '0.05em',
            }}>// List is empty — add your first task above</li>
          ) : (
            tasks.map((task) => renderTask(task, true))
          )}
        </ul>
      </div>

      {/* Overview title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        <span style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '0.7rem',
          color: '#3a6a3a',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}>OVERVIEW</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Two column overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>

        {/* Unfinished */}
        <div style={{
          background: 'rgba(255,100,0,0.03)',
          border: '1px solid rgba(255,100,0,0.12)',
          borderRadius: '6px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(255,100,0,0.1)',
          }}>
            <span style={{ fontSize: '0.85rem' }}>❌</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.7rem',
              color: '#8a5a2a',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              flex: 1,
            }}>UNFINISHED</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.7rem',
              color: '#ff8c00',
              background: 'rgba(255,140,0,0.1)',
              border: '1px solid rgba(255,140,0,0.2)',
              padding: '1px 8px',
              borderRadius: '10px',
            }}>{pendingTasks.length}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.length === 0 ? (
              <li style={emptyStyle}>──</li>
            ) : pendingTasks.length === 0 ? (
              <li style={{ ...emptyStyle, color: '#00ff64' }}>All tasks completed</li>
            ) : (
              pendingTasks.map((task) => renderTask(task, false))
            )}
          </ul>
        </div>

        {/* Completed */}
        <div style={{
          background: 'rgba(0,255,100,0.02)',
          border: '1px solid rgba(0,255,100,0.1)',
          borderRadius: '6px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(0,255,100,0.08)',
          }}>
            <span style={{ fontSize: '0.85rem' }}>✅</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.7rem',
              color: '#2a5a2a',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              flex: 1,
            }}>COMPLETED</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.7rem',
              color: '#00ff64',
              background: 'rgba(0,255,100,0.1)',
              border: '1px solid rgba(0,255,100,0.2)',
              padding: '1px 8px',
              borderRadius: '10px',
            }}>{completedTasks.length}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.length === 0 ? (
              <li style={emptyStyle}>──</li>
            ) : completedTasks.length === 0 ? (
              <li style={emptyStyle}>Nothing completed yet</li>
            ) : (
              completedTasks.map((task) => renderTask(task, false))
            )}
          </ul>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.65rem',
        color: '#1a2a1a',
        letterSpacing: '0.15em',
      }}>
        SYS_STATUS: ONLINE · TASKS: {tasks.length} · PENDING: {pendingTasks.length}
      </div>

    </div>
  );
}

const emptyStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  color: '#2a3a2a',
  fontSize: '0.8rem',
  padding: '8px 0',
  letterSpacing: '0.05em',
};

export default App;