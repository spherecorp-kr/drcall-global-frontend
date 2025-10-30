import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import type { AuthContextValue } from '@contexts/AuthContext';

/**
 * useAuth Hook
 *
 * Provides access to authentication state and actions.
 * Must be used within AuthProvider.
 *
 * @example
 * function MyComponent() {
 *   const { user, isAuthenticated, logout } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <div>Please log in</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user.firstName}!</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
