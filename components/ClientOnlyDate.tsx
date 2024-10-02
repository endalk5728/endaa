import React from 'react';

interface ClientOnlyDateProps {
  date: Date | string | null | undefined;
}

const ClientOnlyDate: React.FC<ClientOnlyDateProps> = ({ date }) => {
  const formattedDate = date 
    ? (date instanceof Date ? date : new Date(date)).toLocaleDateString() 
    : 'Not published';
  return <>{formattedDate}</>;
};

export default ClientOnlyDate;
