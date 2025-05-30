import { createRoot } from 'react-dom/client'
import './index.css'

// https://stackoverflow.com/questions/79583508/map-does-not-load-properly-using-react-leaflet
import "leaflet/dist/leaflet.css";
import App from './App.tsx';

createRoot(
  document
    .getElementById('root')!)
    .render(
      <App />
    )
