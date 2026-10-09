import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export default function AppProviders({ children }) {
  return <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>;
}
