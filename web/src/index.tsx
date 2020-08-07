import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks'
import { Routes } from './Routes';  
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI!,
    // headers: {
    //   authorization: localStorage.getItem('token'),
    // },
  }),
});


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
