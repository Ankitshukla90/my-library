import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Book, Search, Plus, Home, Library, ArrowLeft, Star, AlertTriangle, Coffee, Heart } from 'lucide-react';


const ReduxContext = createContext();

function createSlice({ name, initialState, reducers }) {
  const actions = {};
  Object.keys(reducers).forEach(key => {
    actions[key] = (payload) => ({ type: `${name}/${key}`, payload });
  });

  const reducer = (state = initialState, action) => {
    const [sliceName, actionType] = action.type.split('/');
    if (sliceName === name && reducers[actionType]) {
      return reducers[actionType](state, action);
    }
    return state;
  };
  return { actions, reducer };
}

function configureStore({ reducer }) {
  let state = {};
  const listeners = new Set();
  Object.keys(reducer).forEach(key => {
    state[key] = reducer[key](undefined, { type: '@@INIT' });
  });
  const getState = () => state;
  const dispatch = (action) => {
    let hasChanged = false;
    const newState = {};
    Object.keys(reducer).forEach(key => {
      const previousStateForKey = state[key];
      const nextStateForKey = reducer[key](previousStateForKey, action);
      newState[key] = nextStateForKey;
      if (nextStateForKey !== previousStateForKey) hasChanged = true;
    });
    state = newState;
    if (hasChanged) listeners.forEach(l => l());
    return action;
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, dispatch, subscribe };
}

const Provider = ({ store, children }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, [store]);
  return (
    <ReduxContext.Provider value={{ state, dispatch: store.dispatch }}>
      {children}
    </ReduxContext.Provider>
  );
};

const useSelector = (selector) => {
  const { state } = useContext(ReduxContext);
  return selector(state);
};

const useDispatch = () => {
  const { dispatch } = useContext(ReduxContext);
  return dispatch;
};

// --- DATA ---
const getCover = (title, color = "047857") => 
  `https://placehold.co/400x600/${color}/f0fdf4?text=${encodeURIComponent(title)}`;

const initialBooks = [
  // Classic
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", rating: 4.7, description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.", cover: getCover("The Great Gatsby", "1c1917") },
  { id: 101, title: "Pride and Prejudice", author: "Jane Austen", category: "Classic", rating: 4.8, description: "A romantic novel of manners that follows the character development of Elizabeth Bennet.", cover: getCover("Pride & Prejudice", "292524") },
  { id: 102, title: "Moby Dick", author: "Herman Melville", category: "Classic", rating: 4.2, description: "The narrative of the sailor Ishmael and the obsessive quest of Ahab for the white whale.", cover: getCover("Moby Dick", "44403c") },
  
  // Sci-Fi
  { id: 2, title: "Dune", author: "Frank Herbert", category: "Sci-Fi", rating: 4.8, description: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding.", cover: getCover("Dune", "c2410c") },
  { id: 7, title: "Project Hail Mary", author: "Andy Weir", category: "Sci-Fi", rating: 4.9, description: "Ryland Grace is the sole survivor on a desperate, last-chance mission.", cover: getCover("Hail Mary", "b45309") },
  { id: 201, title: "Neuromancer", author: "William Gibson", category: "Sci-Fi", rating: 4.5, description: "A high-octane thriller that launched the cyberpunk genre.", cover: getCover("Neuromancer", "9a3412") },

  // Non-Fiction
  { id: 3, title: "Becoming", author: "Michelle Obama", category: "Non-Fiction", rating: 4.9, description: "In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic women.", cover: getCover("Becoming", "047857") },
  { id: 6, title: "Clean Code", author: "Robert C. Martin", category: "Non-Fiction", rating: 4.5, description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", cover: getCover("Clean Code", "065f46") },
  { id: 301, title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", rating: 4.7, description: "A brief history of humankind, exploring the ways in which biology and history have defined us.", cover: getCover("Sapiens", "064e3b") },

  // Fiction
  { id: 4, title: "1984", author: "George Orwell", category: "Fiction", rating: 4.6, description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting.", cover: getCover("1984", "991b1b") },
  { id: 401, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", rating: 4.8, description: "A story about the essential wisdom of listening to our hearts.", cover: getCover("The Alchemist", "b91c1c") },
  { id: 402, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", rating: 4.9, description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by prejudice.", cover: getCover("Mockingbird", "7f1d1d") },

  // Fantasy
  { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", rating: 4.8, description: "A timeless classic of Bilbo Baggins and his journey.", cover: getCover("The Hobbit", "5b21b6") },
  { id: 501, title: "Harry Potter", author: "J.K. Rowling", category: "Fantasy", rating: 4.9, description: "The adventures of a young wizard and his friends at Hogwarts School of Witchcraft and Wizardry.", cover: getCover("Harry Potter", "6d28d9") },
  { id: 502, title: "The Name of the Wind", author: "Patrick Rothfuss", category: "Fantasy", rating: 4.7, description: "The tale of Kvothe, from his childhood in a troupe of traveling players to his years as a lone orphan.", cover: getCover("Name of Wind", "4c1d95") },

  // Mystery
  { id: 8, title: "The Da Vinci Code", author: "Dan Brown", category: "Mystery", rating: 3.8, description: "A murder in the Louvre and clues in Da Vinci paintings lead to the discovery of a religious mystery.", cover: getCover("Da Vinci Code", "3730a3") },
  { id: 601, title: "Gone Girl", author: "Gillian Flynn", category: "Mystery", rating: 4.1, description: "Marriage can be a real killer. A thriller about a woman who disappears on her fifth wedding anniversary.", cover: getCover("Gone Girl", "4338ca") },
  { id: 602, title: "The Silent Patient", author: "Alex Michaelides", category: "Mystery", rating: 4.4, description: "Alicia Berenson's life is seemingly perfect... until she shoots her husband five times in the face.", cover: getCover("Silent Patient", "312e81") },
];

// --- REDUX SLICE & STORE ---
const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooks,
  reducers: {
    addBook: (state, action) => {
      
      return [action.payload, ...state];
    },
  },
});

const { addBook } = booksSlice.actions;

const store = configureStore({
  reducer: {
    books: booksSlice.reducer,
  },
});



// 1. Navbar
const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-orange-100 text-orange-800' 
        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
    }`;

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/90 backdrop-blur-md shadow-xl border border-stone-100 rounded-full px-6 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-emerald-900 font-bold text-xl tracking-tight group">
            <div className="bg-emerald-900 text-white p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <Library size={20} />
            </div>
            <span>Sushh<span className="text-orange-600">.lib</span></span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            <NavLink to="/" className={linkClass} end>
              <Home size={18} /> <span>Home</span>
            </NavLink>
            <NavLink to="/books" className={linkClass}>
              <Search size={18} /> <span>Browse</span>
            </NavLink>
            <NavLink to="/add" className={linkClass}>
              <Plus size={18} /> <span>Add Book</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Layout
const Layout = () => (
  <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-stone-800 selection:bg-orange-200">
    <Navbar />
    {/* Added pt-28 to account for fixed navbar */}
    <main className="flex-grow container mx-auto px-4 py-8 pt-28 max-w-6xl">
      <Outlet />
    </main>
    <footer className="bg-stone-100 border-t border-stone-200 mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-stone-500 font-medium">
          Made with <Coffee size={16} className="text-orange-700"/> and React by Ankit Shukla
        </p>
        <p className="text-xs text-stone-400 mt-2">© {new Date().getFullYear()} Sushh Online Library System</p>
      </div>
    </footer>
  </div>
);

// 2. Home Page
const HomePage = () => {
  const books = useSelector((state) => state.books);
  const popularBooks = books.filter((b) => b.rating > 4.7).slice(0, 4);
  const categories = ["Fiction", "Non-Fiction", "Sci-Fi", "Mystery", "Classic", "Fantasy"];
  
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-stone-50 rounded-[2rem] p-8 md:p-16 shadow-2xl overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-1 rounded-full text-emerald-200 text-sm font-bold mb-6 border border-emerald-700">
            <Star size={14} /> Open 24/7 for Bookworms
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Find your next <br/>
            <span className="text-orange-400 italic">favorite story.</span>
          </h1>
          <p className="text-lg text-emerald-100 mb-8 leading-relaxed max-w-lg">
            Welcome to my personal library project. Explore {books.length} curated titles, 
            read descriptions, or help grow the collection.
          </p>
          <div className="flex gap-4">
            <Link to="/books" className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-transform hover:-translate-y-1">
              Start Reading
            </Link>
            <Link to="/add" className="px-6 py-3 bg-emerald-800 text-emerald-100 font-bold rounded-xl hover:bg-emerald-700 transition-colors">
              Add a Book
            </Link>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute -right-20 -bottom-40 text-emerald-800 opacity-20 rotate-12">
          <Library size={400} />
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-end justify-between mb-8 px-2">
           <div>
             <h2 className="text-2xl font-bold text-stone-800 font-serif">Pick a Genre</h2>
             <p className="text-stone-500 text-sm">What are you in the mood for?</p>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={cat}
              to={`/books/${cat}`}
              className="group bg-white border border-stone-200 p-6 rounded-2xl hover:border-orange-300 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center h-32"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {idx === 0 ? "🏰" : idx === 1 ? "🧠" : idx === 2 ? "🚀" : idx === 3 ? "🕵️‍♀️" : idx === 4 ? "🎻" : "🐉"}
              </span>
              <span className="font-bold text-stone-700 group-hover:text-orange-600">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Books */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
             <h2 className="text-2xl font-bold text-stone-800 font-serif">Readers' Favorites</h2>
             <p className="text-stone-500 text-sm">Highly rated gems you shouldn't miss.</p>
          </div>
          <Link to="/books" className="text-emerald-700 font-bold text-sm hover:underline">View All →</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularBooks.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 h-full flex flex-col">
                <div className="aspect-[2/3] overflow-hidden bg-stone-200 relative">
                   <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                   />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-stone-800 line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">{book.title}</h3>
                  <p className="text-xs text-stone-500 mb-2">by {book.author}</p>
                  <div className="mt-auto flex items-center text-orange-500 text-xs font-bold">
                     <Star size={12} fill="currentColor" className="mr-1" /> {book.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

// 3. Browse Books
const BrowseBooks = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const books = useSelector((state) => state.books);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter((book) => {
    const matchesCategory = category ? book.category.toLowerCase() === category.toLowerCase() : true;
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
        <div>
          {category && (
            <button
              onClick={() => navigate(-1)}
              className="text-stone-400 hover:text-orange-600 mb-2 flex items-center text-sm font-bold transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
          )}
          <h2 className="text-3xl font-serif font-bold text-stone-800">
            {category ? <span className="text-emerald-800">{category} Collection</span> : "The Shelves"}
          </h2>
          <p className="text-stone-500 mt-1">
             Browsing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all shadow-sm text-stone-700"
            placeholder="Search titles or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-stone-400" size={18} />
        </div>
      </div>

      {/* Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm hover:shadow-lg transition-all group flex gap-4 h-full">
              {/* Spine/Cover */}
              <div className="w-24 flex-shrink-0 bg-stone-200 rounded shadow-inner overflow-hidden">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{book.category}</span>
                  <h3 className="font-bold text-stone-800 leading-snug mt-1 group-hover:text-orange-600 transition-colors">{book.title}</h3>
                  <p className="text-xs text-stone-500 mt-1">by {book.author}</p>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                   <div className="flex text-orange-400 text-xs">
                     {[...Array(Math.floor(book.rating))].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                   </div>
                   <Link to={`/book/${book.id}`} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                     View
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-stone-200">
          <div className="inline-block p-4 bg-stone-50 rounded-full mb-4">
             <Coffee size={32} className="text-stone-300" />
          </div>
          <p className="text-stone-600 font-bold text-lg">Empty Shelf!</p>
          <p className="text-stone-400 text-sm">We couldn't find any books matching that.</p>
          {category && (
            <button onClick={() => navigate('/books')} className="mt-4 text-orange-600 text-sm font-bold hover:underline">
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// 4. Book Details
const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const books = useSelector((state) => state.books);
  
  const book = books.find((b) => b.id == id);

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-800">Book not found</h2>
        <button onClick={() => navigate('/books')} className="mt-4 text-emerald-600 hover:underline">
          Go back to shelves
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-stone-500 hover:text-stone-800 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 flex flex-col md:flex-row">
        {/* Visual Side */}
        <div className="md:w-5/12 bg-stone-100 relative group overflow-hidden">
          <img 
            src={book.cover} 
            alt={book.title} 
            className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Text Side */}
        <div className="p-8 md:p-12 md:w-7/12 flex flex-col">
          <div className="mb-6">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                   {book.category}
                </span>
                <span className="flex items-center text-orange-500 font-bold text-sm">
                  <Star size={14} fill="currentColor" className="mr-1"/> {book.rating}/5.0
                </span>
             </div>
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 leading-tight mb-2">{book.title}</h1>
             <p className="text-stone-500 font-medium">by {book.author}</p>
          </div>

          <div className="prose prose-stone mb-8">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-2">Synopsis</h3>
            <p className="text-stone-600 leading-relaxed">
              {book.description}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-stone-100 flex gap-4">
             <button className="flex-1 bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-100/50">
               Borrow Book
             </button>
             <button className="p-3 border-2 border-stone-200 text-stone-400 rounded-xl hover:text-red-500 hover:border-red-200 transition-colors">
               <Heart size={24} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Add Book
const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    rating: ''
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Every book needs a title!";
    if (!formData.author) newErrors.author = "Who wrote this masterpiece?";
    if (!formData.category) newErrors.category = "Please file this under a category.";
    if (!formData.description) newErrors.description = "Tell us a little about it.";
    if (!formData.rating || formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newBook = {
      id: Date.now(),
      ...formData,
      rating: parseFloat(formData.rating),
      cover: `https://placehold.co/400x600/047857/white?text=${encodeURIComponent(formData.title)}`
    };

    dispatch(addBook(newBook));
    navigate('/books');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const labelClass = "block text-stone-600 font-bold mb-2 text-sm";
  const inputClass = (error) => 
    `w-full px-4 py-3 rounded-xl border-2 ${error ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white hover:border-emerald-300 focus:border-emerald-500'} focus:outline-none transition-all duration-200`;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-stone-800">Contribute a Book</h1>
        <p className="text-stone-500">Help grow our community library by adding a new title.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 space-y-6">
        
        {/* Title */}
        <div>
          <label className={labelClass}>Book Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass(errors.title)}
            placeholder="e.g. The Hobbit"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1 font-bold">{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label className={labelClass}>Author</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={inputClass(errors.author)}
            placeholder="e.g. J.R.R. Tolkien"
          />
          {errors.author && <p className="text-red-500 text-xs mt-1 font-bold">{errors.author}</p>}
        </div>

        {/* Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass(errors.category)}
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Mystery">Mystery</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Classic">Classic</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category}</p>}
          </div>

          <div>
            <label className={labelClass}>Rating (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className={inputClass(errors.rating)}
              placeholder="4.5"
            />
            {errors.rating && <p className="text-red-500 text-xs mt-1 font-bold">{errors.rating}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Synopsis</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={inputClass(errors.description)}
            placeholder="What makes this book worth reading?"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.description}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-800 text-white font-bold py-4 rounded-xl hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-200 mt-4"
        >
          Add to Collection
        </button>
      </form>
    </div>
  );
};

// 6. 404 Page 
const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-[2rem] shadow-2xl border-2 border-stone-100 max-w-lg w-full transform rotate-1">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
            <AlertTriangle size={40} />
        </div>
        <h1 className="text-5xl font-serif font-bold text-stone-800 mb-2">404</h1>
        <h2 className="text-xl font-bold text-stone-500 mb-6">Lost in the stacks?</h2>
        
        <p className="text-stone-500 mb-8">
          We couldn't find the page <code className="bg-stone-100 px-2 py-1 rounded text-red-500 font-mono text-sm">{location.pathname}</code>. 
          It might have been moved or never written.
        </p>
        
        <Link 
            to="/" 
            className="inline-block bg-stone-800 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors"
        >
            Back to Safety
        </Link>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          {/* Header Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BrowseBooks />} />
            <Route path="/books/:category" element={<BrowseBooks />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/add" element={<AddBook />} />
          </Route>

          {/* 404 No Header */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
}