import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/styles/dashboard-theme.css';
import App from './App';

// Initialize theme from localStorage to ensure dark mode is applied before paint
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  }
} catch {}

// mock API removed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
