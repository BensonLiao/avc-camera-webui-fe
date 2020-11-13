import React from 'react';
import ErrorPage from './error-page';

const NotFound = () => {
  return (
    <ErrorPage error={{
      status: 404,
      message: 'Not Found'
    }}
    />
  );
};

export default NotFound;
