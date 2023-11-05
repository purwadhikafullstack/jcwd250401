<<<<<<< HEAD
import { Button } from 'flowbite-react';
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import VerifyModal from './components/VerifyModal';
import CreatePasswordModal from './components/CreatePasswordModal';
export default function App() {
  return (
    <div>
      <Button color='blue'>Click me</Button>
      <SignUpModal />
      <LoginModal />
      <VerifyModal />
      <CreatePasswordModal />
    </div>
    
=======
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
>>>>>>> bae558ff69b1d0a0e4c129cf25ec52088adc6483
  );
}
