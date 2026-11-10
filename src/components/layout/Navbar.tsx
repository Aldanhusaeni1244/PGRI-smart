import React from 'react';
import { Header } from './Header';

interface NavbarProps {
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  return <Header {...props} />;
};
