import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

import Header from './components/header';
import LazyLoad from 'react-lazyload';

import('./services/lazyloaded').then((module) => {
  const { default: lazyloaded } = module;
  ReactDOM.render(
    <LazyLoad once>
      <Header>Hello world! { lazyloaded } </Header>
    </LazyLoad>,
    document.getElementById('app')
  );
});