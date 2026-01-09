'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/authSlice';
import { useEffect } from 'react';

function AuthLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);
    return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthLoader>{children}</AuthLoader>
        </Provider>
    );
}
