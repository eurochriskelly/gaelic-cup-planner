import React from 'react';

const KanbanErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="kanban-error-message">
      {message}
    </div>
  );
};

export default KanbanErrorMessage;
