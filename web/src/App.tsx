import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Saisie from './pages/Saisie';
import Validation from './pages/Validation';
import Suivi from './pages/Suivi';
import Reunions from './pages/Reunions';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ardoise-50 text-encre">
        <header className="bg-marine-900">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <span className="font-medium text-white">
              ActionOS <span className="text-or-500">Lite</span>
            </span>
            <Link to="/reunions" className="text-sm text-slate-300 hover:text-white">
              Comptes rendus
            </Link>
            <Link to="/saisie" className="text-sm text-slate-300 hover:text-white">
              Nouveau compte rendu
            </Link>
            <Link to="/suivi" className="text-sm text-slate-300 hover:text-white">
              Suivi des actions
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/reunions" replace />} />
            <Route path="/reunions" element={<Reunions />} />   
            <Route path="/saisie" element={<Saisie />} />
            <Route path="/validation/:id" element={<Validation />} />
            <Route path="/suivi" element={<Suivi />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}