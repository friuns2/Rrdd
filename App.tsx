
import React, { useState, useEffect, useCallback } from 'react';
import { Todo } from './types';
import TodoItem from './components/TodoItem';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    if (text.trim() === '') {
      return;
    }
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodoText('');
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(newTodoText);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed;
    }
    if (filter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  const clearCompleted = useCallback(() => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  }, []);

  return (
    <div className="flex flex-col min-h-[500px] w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-purple-700 pt-8 pb-6 px-4 bg-gradient-to-r from-purple-50 to-indigo-50">
        My To-Do List
      </h1>

      <div className="p-6 md:p-8 flex-grow flex flex-col">
        <form onSubmit={handleFormSubmit} className="mb-6 flex space-x-2">
          <input
            type="text"
            value={newTodoText}
            onChange={handleInputChange}
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            aria-label="New todo item text"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
            aria-label="Add new todo"
          >
            Add
          </button>
        </form>

        {filteredTodos.length === 0 && (
          <p className="text-center text-gray-500 text-lg py-8">
            {filter === 'all' && "No tasks yet! Add one above."}
            {filter === 'active' && "No active tasks."}
            {filter === 'completed' && "No completed tasks."}
          </p>
        )}

        <ul className="flex-grow overflow-y-auto pr-2 -mr-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75`}
            aria-pressed={filter === 'all'}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'active'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75`}
            aria-pressed={filter === 'active'}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'completed'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75`}
            aria-pressed={filter === 'completed'}
          >
            Completed
          </button>
        </div>
        <button
          onClick={clearCompleted}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
};

export default App;
