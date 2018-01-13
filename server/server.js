import Express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';

// Webpack Requirements
import webpack from 'webpack';
import webpackConfig from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';


const app = new Express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// // React And Redux Setup
// import { configureStore } from '../client/store';
// import { Provider } from 'react-redux';
// import React from 'react';
// import { renderToString } from 'react-dom/server';
// import { match, RouterContext } from 'react-router';
// import Helmet from 'react-helmet';


app.use(compression());

app.use(express.static( path.join(__dirname, './client' )));
app.use(express.static( path.join(__dirname, './bower_components')));
app.use(express.static( path.join(__dirname, "uploads")));

app.use(bp.json())
app.use(bp.urlencoded({extended:true}))

//run schema to prep database
require('./server/config/mongoose')

//configure routes
import router from './config/routes';
app.use('/api', router)

app.use(function(err, req, res, next) {
  console.log("Entered generic error handler")
  console.log(err)
  res.status(err.status || 500);
  res.json({
    success:false,
    message: err.message,
    errors: err
  });
});

// Initialize the app.
var server = app.listen( port, function () {
  console.log("App now running on port", port);
});