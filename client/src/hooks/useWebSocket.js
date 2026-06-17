import { useEffect, useRef } from 'react';
import useBoardStore from '../store/boardStore';

const useWebSocket = (boardId, token) => {
  const ws = useRef(null);
  const { addTask, updateTask, removeTask } = useBoardStore();

  useEffect(() => {
    if (!boardId || !token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${window.location.host}/ws?token=${token}&boardId=${boardId}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => console.log('WebSocket connected');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'TASK_CREATED') addTask(data.task);
      if (data.type === 'TASK_UPDATED') updateTask(data.task);
      if (data.type === 'TASK_DELETED') removeTask(data.taskId);
    };

    ws.current.onclose = () => console.log('WebSocket disconnected');

    return () => ws.current?.close();
  }, [boardId, token]);
};

export default useWebSocket;