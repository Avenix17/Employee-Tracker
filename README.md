# Employee-Tracker

## Description

This repository is an Employee Tracker for business owners to be able to view and manage different aspects of their company so that they are more organized and planned.

## Installation

Run `npm i`

Within db folder:
* run `mysql -u root -p`
* When in mysql `source schema.sql`
* `source seeds.sql`
* Exit msql

Put your mysql password in the server.js file on line 13

Invoke application in main folder by command-line command: `node server.js`

## Walkthrough Video

[Employee Tracker demo](https://drive.google.com/file/d/1igjIYeimAgePkigIlayaWorXgqla2DXi/view)

## Change Log

### 2022-09-09

* Updated README
* Finished cleaning code and fixed some comments

### 2022-09-08

* Finished other functions
* Fixed minor issues within code and deleted extra choices (can be done in future)

### 2022-09-07

* Added main menu with inquirer, began functions for each decision
* Created seeds.sql for database