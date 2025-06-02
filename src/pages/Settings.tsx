import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { isAuthenticated, getUsername } from '../utils/auth';

// ancienne page settings (non utilsiée)

function SettingsPage () {

    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();



    useEffect(() => {
        if (!isAuthenticated()) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setUsername(getUsername());
        }
      }, []);
    
    return (

        <div>
            <div className='p-3'>

            <a className="p-ripple flex align-items-center p-3 text-white hover:bg-gray-800 cursor-pointer" onClick={() => navigate('/landing-page')}>
                <i className="pi pi-home mr-2"></i>
                <span className="font-medium">Retourner sur la page d&apos;accueil</span>
            </a>




                <div className='flex flex-row'>
                    <img src="src/assets/images/agriventure-logo.png" alt="agriventure" width={150} height={150}/>
                </div>


                <p>Votre compte : {username}</p>

                <p>Réinitilisation mot de passe:</p>
            </div>

        </div>

    )

}

export default SettingsPage