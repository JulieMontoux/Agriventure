import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Button as PrimeReactButton } from 'primereact/button';

// sidebar

import logo from '../assets/images/agriventure-logo.png'; 

export default function SidebarTest() {
    const [visible, setVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="card flex flex-column align-items-start gap-3">
            <Button 
                className="bg-transparent border-transparent" 
                icon="pi pi-bars" 
                onClick={() => setVisible(true)} 
            />

            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                content={({ closeIconRef, hide }) => (
                    <div className="min-h-screen flex relative">
                        <div 
                            className="h-screen flex-shrink-0 absolute left-0 top-0 z-1 select-none" 
                            style={{ width: '280px', backgroundColor: '#1F1D2B', border: 'none' }}
                        >
                            <div className="flex flex-column h-full text-white">
                                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                                    <span className="inline-flex align-items-center gap-2">
                                        <img src={logo} alt="Logo Agriventure" width={150} height={150} />
                                    </span>
                                    <Button 
                                        type="button" 
                                        ref={closeIconRef as React.Ref<PrimeReactButton>} 
                                        onClick={(e) => hide(e)} 
                                        icon="pi pi-times" 
                                        rounded 
                                        outlined 
                                        className="h-2rem w-2rem" 
                                    />
                                </div>

                                <div className="overflow-y-auto">
                                    <ul className="list-none p-3 m-0">
                                        {isAdmin && (
                                            <li>
                                                <a 
                                                    className="p-ripple flex align-items-center p-3 text-white hover:bg-gray-800 cursor-pointer" 
                                                    onClick={() => navigate('/admin-panel')}
                                                >
                                                    <i className="pi pi-home mr-2"></i>
                                                    <span className="font-medium">Dashboard</span>
                                                </a>
                                            </li>
                                        )}
                                        {isAdmin && (
                                            <li>
                                                <a 
                                                    className="p-ripple flex align-items-center p-3 text-white hover:bg-gray-800 cursor-pointer" 
                                                    onClick={() => navigate('/add-product')}
                                                >
                                                    <i className="pi pi-plus mr-2"></i>
                                                    <span className="font-medium">Ajouter un produit</span>
                                                </a>
                                            </li>
                                        )}
                                        <li>
                                            <a 
                                                className="p-ripple flex align-items-center p-3 text-white hover:bg-gray-800 cursor-pointer" 
                                                onClick={() => navigate('/settings')}
                                            >
                                                <i className="pi pi-cog mr-2"></i>
                                                <span className="font-medium">Settings</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-auto">
                                    <hr className="mb-3 mx-3 border-top-1 border-none" />
                                    <button 
                                        onClick={handleLogout} 
                                        className="m-3 flex align-items-center p-3 gap-2 text-red-400 cursor-pointer p-ripple bg-transparent border-none w-full text-left"
                                    >
                                        <i className="pi pi-sign-out"></i>
                                        <span>Se déconnecter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
