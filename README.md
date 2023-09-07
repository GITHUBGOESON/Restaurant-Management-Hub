# Bluelime Management Portal

Welcome to the Bluelime Management Portal project! This project aims to provide a comprehensive web-based admin portal for managing various aspects of a restaurant's operations, including customer orders, reservations, menu items, and more.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Starting JSON Servers](#starting-json-servers)
- [Features](#features)
- [Technologies Used](#technologies-used)


## Getting Started

Follow the steps below to set up and run the Bluelime Management Portal project on your local machine.

### Prerequisites

Before you begin, ensure you have the following software installed:

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [json-server](https://github.com/typicode/json-server) - Simulate a RESTful API server using JSON files

### Installation 
1. Clone the repository:

```bash
git clone https://gitlab.stackroute.in/group18_restaurantmanagemet/restaurant_management_hub.git
cd restaurant_management_hub
```

2. Install project dependencies:
```bash
npm install
npm i json-server
```


## Start the JSON servers for each module (Make sure you have the required JSON files in each module's directory):
### Users JSON Server
```
cd Orders
json-server --watch ./orders.json -p 4500
```

### Reservations JSON Server
```
cd Table_Reservation
json-server --watch ./reservations.json -p 5000
```

### Customer JSON Server
```
cd Customer
json-server --watch ./customer.json -p 4000
```

### Menu Items JSON Server
```
cd MenuItems
json-server --watch ./MenuItems.json
```

### Start nodejs Server
```
node .\httpServer.js
```
After starting NodeJs Server go to web-browser and Localhost:8881 port.
Open the different HTML files in your web browser to access the respective admin modules.

## Features
Manage customer orders and reservations.
Add, edit, and delete menu items.
View and calculate bills for orders.

## Technologies Used
HTML, CSS, JavaScript
Bootstrap CSS framework
jQuery for DOM manipulation
JSON-Server for simulating backend APIs



&copy; 2023 Bluelime Management Portal Team
