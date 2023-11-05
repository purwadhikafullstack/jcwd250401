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
    
  );
}

