import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import BoardLayout from './components/BoardLayout';
import ViewTaskPage from './components/ViewTaskPage';
import NewBoard from './features/boards/NewBoard';
import EditBoard from './features/boards/EditBoard';
import DeleteBoard from './features/boards/DeleteBoard';
import EditTask from './features/tasks/EditTask';
import NewTask from './features/tasks/NewTask';
import DeleteTask from './features/tasks/DeleteTask';
// import Board from './components/Board';
import BoardWithId from './components/BoardWithId';
function App() {
  return (
    <Routes>
      <Route path="" >
        <Route index element={<Home />} />
        <Route path="board" element={<BoardLayout />}>
          <Route path="createboard" element={<NewBoard />} />
          <Route path=":id">
            <Route index element={<BoardWithId />} />
            <Route path="editboard" element={<EditBoard />} />
            <Route path="createboard" element={<NewBoard />} />
            <Route path="deleteboard" element={<DeleteBoard />} />
            <Route path="createtask" element={<NewTask />} />
            <Route path="column/:columnid/task/:taskid" >
              <Route index element={<ViewTaskPage />} />
              <Route path="edittask" element={<EditTask />} />
              <Route path="deletetask" element={<DeleteTask />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
