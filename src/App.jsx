import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Descoberta from "./pages/app/Descoberta.jsx";
import Chat from "./pages/app/Chat.jsx";
import Treino from "./pages/app/Treino.jsx";
import Mapa from "./pages/app/Mapa.jsx";
import Tempos from "./pages/app/Tempos.jsx";
import Confronto from "./pages/app/Confronto.jsx";
import Consultoria from "./pages/app/Consultoria.jsx";
import Ranking from "./pages/app/Ranking.jsx";
import Perfil from "./pages/app/Perfil.jsx";

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
        <Route path="treino" element={<Treino />} />
        {/* Rotas antigas: redirecionam pra página única com o tipo certo. */}
        <Route
          path="treino-individual"
          element={<Navigate to="/app/treino?tipo=individual" replace />}
        />
        <Route
          path="treino-equipe"
          element={<Navigate to="/app/treino?tipo=equipe" replace />}
        />
        <Route path="mapa" element={<Mapa />} />
        {/* Rota antiga do Cronômetro: mantém link velho funcionando. */}
        <Route path="cronometro" element={<Navigate to="/app/mapa" replace />} />
        <Route path="tempos" element={<Tempos />} />
        <Route path="confronto" element={<Confronto />} />
        <Route path="consultoria" element={<Consultoria />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
