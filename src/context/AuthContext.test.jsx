import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider, useAuth } from './AuthContext.jsx';

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    auth: {},
}));

function AuthState() {
    const { user, loading } = useAuth();
    return (
        <p>
            {loading ? 'Loading' : user ? `Signed in: ${user.email}` : 'Signed out'}
        </p>
    );
}

describe('AuthProvider', () => {
    it('provides children and updates the auth state', () => {
        let authStateChanged;
        onAuthStateChanged.mockImplementation((_auth, callback) => {
            authStateChanged = callback;
            return vi.fn();
        });

        render(
            <AuthProvider>
                <AuthState />
            </AuthProvider>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();

        act(() => authStateChanged({ email: 'ayush@example.com' }));

        expect(screen.getByText('Signed in: ayush@example.com')).toBeInTheDocument();
    });

    it('clears loading and user state when Firebase reports an error', () => {
        let authError;
        onAuthStateChanged.mockImplementation((_auth, _callback, onError) => {
            authError = onError;
            return vi.fn();
        });

        render(
            <AuthProvider>
                <AuthState />
            </AuthProvider>
        );

        act(() => authError(new Error('Auth state unavailable')));

        expect(screen.getByText('Signed out')).toBeInTheDocument();
    });
});
