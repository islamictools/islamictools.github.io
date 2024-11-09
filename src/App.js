import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes.js';

function App() {
  return (
    <Router>
      <Routes>
        {Object.keys(routes).map( k => {
          const [route, Element] =  [k, routes[k]];
          return <Route path={k} element={<Element />} key={k} />;
        })}
      </Routes>
    </Router>
  );
}

export default App;
