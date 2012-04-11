var initializes = require('./initializes');
var express = require('express');
var pg = require('pg');

console.log('wakeup...');
initializes.initialize(express, pg);
console.log('main-process end.');
