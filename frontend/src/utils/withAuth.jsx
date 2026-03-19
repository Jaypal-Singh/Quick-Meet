import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const server = import.meta.env.VITE_API_URL;

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const [authenticated, setAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get(`${server}/api/v1/users/check_auth`, {
                        withCredentials: true
                    });
                    if (response.data.authenticated) {
                        setAuthenticated(true);
                    } else {
                        navigate("/login");
                    }
                } catch (err) {
                    console.error("Auth check failed:", err);
                    navigate("/login");
                } finally {
                    setLoading(false);
                }
            };

            checkAuth();
        }, [navigate]);

        if (loading) {
            return (
                <div style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#0B0F19',
                    color: 'white'
                }}>
                    Loading...
                </div>
            );
        }

        return authenticated ? <WrappedComponent {...props} /> : null;
    }

    return AuthComponent;
}

export default withAuth;