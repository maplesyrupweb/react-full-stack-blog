import './App.css';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import AboutPage from '../src/pages/AboutPage';
import ArticlePage from '../src/pages/ArticlePage';
import ArticlesListPage from './pages/ArticlesListPage';
import NotFoundPage from './pages/NotFoundPage';
import NavBar from "../src/Navbar";

function App() {
  return (
    
    <BrowserRouter>
      <div className="App">
        < NavBar />
        <div id="page-body">
        
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/articles" element={<ArticlesListPage />}/>
            <Route path="/articles/:articleId" element={<ArticlePage />}/>
            <Route path="/articles/:*" element={<NotFoundPage />}/>
            <Route path="*" element={<NotFoundPage />}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
