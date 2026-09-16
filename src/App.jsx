import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Descoberta from "./pages/app/Descoberta.jsx";
import Chat from "./pages/app/Chat.jsx";
import TreinoIndividual from "./pages/app/TreinoIndividual.jsx";
import TreinoEquipe from "./pages/app/TreinoEquipe.jsx";
import Cronometro from "./pages/app/Cronometro.jsx";
import Tempos from "./pages/app/Tempos.jsx";
import Confronto from "./pages/app/Confronto.jsx";
import Consultoria from "./pages/app/Consultoria.jsx";
import Ranking from "./pages/app/Ranking.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="descoberta" replace />} />
        <Route path="descoberta" element={<Descoberta />} />
        <Route path="chat" element={<Chat />} />
        <Route path="treino-individual" element={<TreinoIndividual />} />
        <Route path="treino-equipe" element={<TreinoEquipe />} />
        <Route path="cronometro" element={<Cronometro />} />
        <Route path="tempos" element={<Tempos />} />
        <Route path="confronto" element={<Confronto />} />
        <Route path="consultoria" element={<Consultoria />} />
        <Route path="ranking" element={<Ranking />} />
      </Route>
    </Routes>
  );
}
