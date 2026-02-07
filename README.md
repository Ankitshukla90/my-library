Sushh Online Library System

Welcome to the Sushh Online Library System, a modern, responsive single-page application built with React, Redux, and Tailwind CSS. This project simulates an online library where users can browse books, filter by category, search by title/author, and add new books to the collection.



Features;

Home Page: A welcoming landing page featuring popular books and category shortcuts.

Browse Books: * Filter books by category (Dynamic Routing: /books/:category).

Search functionality for filtering by title or author.

"Back" button navigation.

Book Details: A dedicated page displaying full book information (Title, Author, Description, Rating).

Add Book: A form to contribute new books to the library.

State managed via Redux Toolkit.

Form validation included.

Newly added books appear at the top of the list.

404 Page: A custom "Page Not Found" route that handles undefined URLs and hides the main navigation bar.

Responsive Design: Fully styled with Tailwind CSS featuring a custom "Indie Bookstore" aesthetic (Warm Stone & Emerald theme).




Tech;

React (Vite)

Redux Toolkit (State Management)

React Router DOM (Routing & Navigation)

Tailwind CSS (Styling)

Lucide React (Icons)




Prerequisites;

Before running the application, ensure you have Node.js installed on your machine.
You can check this by running:

node -v





Installation & Running the App;

Follow these steps to set up and run the project locally:

Clone the repository:

git clone <https://github.com/Ankitshukla90/my-library.git>
cd my-library


Install Dependencies:
This installs React, Redux, Tailwind, and other necessary packages.

npm install

Start the Development Server:

npm run dev


Open in Browser:
Click the link shown in the terminal http://localhost:5173 to view the application.




Project Structure;

src/App.jsx: Contains the main application logic, including the Redux store setup, routing configuration, and all page components.

src/index.css: Contains the Tailwind directives.

tailwind.config.js: Tailwind configuration file.
