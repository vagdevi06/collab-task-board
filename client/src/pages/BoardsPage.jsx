import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoards, deleteBoard } from '../api/boards';
import useBoardStore from '../store/boardStore';
import Navbar from '../components/Navbar';
import CreateBoardModal from '../components/CreateBoardModal';

const BoardsPage = () => {
  const { boards, setBoards } = useBoardStore();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getBoards().then(({ data }) => setBoards(data));
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteBoard(id);
    setBoards(boards.filter((b) => b._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Boards</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + New Board
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">📋</p>
            <p>No boards yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board._id}
                onClick={() => navigate(`/boards/${board._id}`)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{board.name}</h3>
                  <button
                    onClick={(e) => handleDelete(e, board._id)}
                    className="text-gray-300 hover:text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
                {board.description && (
                  <p className="text-gray-500 text-sm mt-1">{board.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && <CreateBoardModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default BoardsPage;