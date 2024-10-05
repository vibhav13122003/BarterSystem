# Barter System Application

A full-stack barter system built using the MERN stack (MongoDB, Express, React, Node.js), where users can list items for trade, search for items offered by others, and propose barter deals. The application provides an intuitive interface for negotiating item exchanges and managing barter offers.



## Features

- **User Authentication**: Secure user registration and login (JWT-based).
- **Item Listings**: Users can create, edit, and delete items available for barter.
- **Search and Filter**: Search for items using keywords, categories, or location.
- **Propose Barter**: Users can propose barter trades and negotiate the exchange of items.
- **Profile Management**: Users can update their profile information and view their barter history.

## Technologies Used

- **Frontend**: React, Axios, Tailwind CSS , Material UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Testing**: Postman (for testing backend API)
- **State Management**: React Context API or Redux (optional)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vibhav13122003/BarterSystem
2. Install Server Dependencies:
   
       cd backend
       npm install

3. Install Front-end Dependencies:

        cd client
        npm install
   
5. Set Up Environment Variables:
   
         MONGO_URI=your-mongodb-connection-string
         JWT_SECRET=your-jwt-secret
         PORT=8000

 **Start the Application**:  
- To start the backend server, navigate to the server directory and run:
  ```
  npm run dev
  ```

- In a new terminal, navigate to the client directory and run:
  ```
  npm run start
  ```

