import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkflowProvider } from './context/WorkflowContext';
import WorkflowList from './pages/WorkflowList';
import WorkflowBuilder from './pages/WorkflowBuilder';
import './App.css';

function App() {
  return (
    <WorkflowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WorkflowList />} />
          <Route path="/workflow" element={<WorkflowBuilder />} />
        </Routes>
      </BrowserRouter>
    </WorkflowProvider>
  );
}

export default App;
