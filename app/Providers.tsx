'use client';
import { Provider } from "react-redux";
import appStore from '../utils/appStore';
import { ReactNode } from "react";


interface ProvidersProps {
    children: ReactNode;
  }
 
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  
    return <Provider store={appStore}>{children}</Provider>;
  };