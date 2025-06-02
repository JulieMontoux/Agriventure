import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI, CompanySettings } from '../utils/apiService';
import '../assets/styles/userSettings.css';
import { useNavigate } from 'react-router-dom';

// page de settings (vendeur + admin)

const UserSettings: React.FC = () => {
  const { user, isAdmin, isVendor } = useAuth();
  const toast = useRef<Toast>(null);
  
  // États pour les paramètres (seulement pour admin)
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo_path: ''
  });
  
  // États pour les dialogues
  const [newSellerDialogVisible, setNewSellerDialogVisible] = useState<boolean>(false);
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerBirthDate, setSellerBirthDate] = useState<Date | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  
  // États pour le changement de mot de passe
  const [passwordDialogVisible, setPasswordDialogVisible] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  
  const [activeIndex, setActiveIndex] = useState<number | number[] | null>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();


  // Charger les données au démarrage (seulement pour admin)
  useEffect(() => {
    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  const loadSettings = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      
      // Charger les paramètres entreprise
      const companyData = await settingsAPI.getCompanySettings();
      setCompanySettings(companyData);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: 'Impossible de charger les paramètres' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction générique pour mettre à jour les paramètres entreprise (admin seulement)
const handleCompanySettingsUpdate = async () => {
  if (!isAdmin || !companySettings.id) return;

  try {
    const updatedSettings = await settingsAPI.updateCompanySettings(companySettings);
    setCompanySettings(updatedSettings);
    toast.current?.show({ summary: 'Succès', detail: 'Paramètres mis à jour', severity: 'success' });
  } catch (error) {
    console.error(error);
  }
};


  const generateRandomPassword = (): string => {
    return settingsAPI.generateRandomPassword();
  };

  const openNewSellerDialog = () => {
    setSellerName('');
    setSellerBirthDate(null);
    setGeneratedPassword(generateRandomPassword());
    setNewSellerDialogVisible(true);
  };

  const handleCreateSeller = async () => {
    if (!sellerName || !sellerBirthDate) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: 'Veuillez remplir tous les champs' 
      });
      return;
    }

    try {
      setLoading(true);
      
      await settingsAPI.createSeller({
        name: sellerName,
        birth_date: sellerBirthDate.toISOString().split('T')[0], // Format YYYY-MM-DD
        password: generatedPassword
      });

      toast.current?.show({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: `Vendeur créé: ${sellerName.toLowerCase().replace(' ', '.')}` 
      });
      
      setNewSellerDialogVisible(false);
    } catch (error) {
      console.error('Erreur création vendeur:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: error instanceof Error ? error.message : 'Échec de la création du vendeur' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: 'Veuillez remplir tous les champs' 
      });
      return;
    }

    try {
      setLoading(true);
      
      await settingsAPI.changeMyPassword({
        old_password: oldPassword,
        new_password: newPassword
      });

      toast.current?.show({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Mot de passe modifié avec succès' 
      });
      
      setPasswordDialogVisible(false);
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: error instanceof Error ? error.message : 'Échec du changement de mot de passe'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isAdmin && !companySettings.name) {
    return <div className="flex justify-content-center p-4">Chargement des paramètres...</div>;
  }

  return (
    
    <div className="user-settings-container">
      <div className="mb-3">
        <Button 
          label="Retour" 
          icon="pi pi-arrow-left" 
          className="p-button-text text-white" 
          onClick={() => navigate('/landing-page')} 
        />
      </div>

      <Toast ref={toast} />
      
      <div className="settings-header">
        <h1>
          {isAdmin ? 'Paramètres Administrateur' : 'Paramètres Vendeur'}
        </h1>
        <div className="user-avatar">
          <span className="avatar-text">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
      
      <div className="settings-accordion-container">
        <Accordion 
          activeIndex={activeIndex} 
          onTabChange={(e) => setActiveIndex(e.index as number | number[] | null)}
          className="settings-accordion"
        >
          {/* Paramètres entreprise - ADMIN SEULEMENT */}
          {isAdmin && (
            <AccordionTab 
              header={
                <div className="accordion-header">
                  <h2>Paramètres de l&apos;entreprise</h2>
                  <p className="settings-description">Informations de base comme le nom, l&apos;adresse, les coordonnées et le logo</p>
                </div>
              }
            >
              <div className="accordion-content">
                <div className="p-field">
                  <label htmlFor="company-name">Nom de l&apos;entreprise</label>
                  <InputText 
                    id="company-name" 
                    value={companySettings.name} 
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                    className="settings-input" 
                  />
                </div>
                
                <div className="p-field">
                  <label htmlFor="company-address">Adresse</label>
                  <InputText 
                    id="company-address" 
                    value={companySettings.address} 
                    onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                    className="settings-input" 
                  />
                </div>
                
                <div className="p-field">
                  <label htmlFor="company-phone">Téléphone</label>
                  <InputText 
                    id="company-phone" 
                    value={companySettings.phone} 
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                    className="settings-input" 
                  />
                </div>
                
                <div className="p-field">
                  <label htmlFor="company-email">Email</label>
                  <InputText 
                    id="company-email" 
                    value={companySettings.email} 
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                    className="settings-input" 
                  />
                </div>

                <div className="p-field">
                  <Button 
                    label="Sauvegarder les modifications" 
                    icon="pi pi-save" 
                    className="p-button-success" 
                    onClick={handleCompanySettingsUpdate}
                    loading={loading}
                  />
                </div>
              </div>
            </AccordionTab>
          )}
          
          {/* Paramètres compte - ADMIN ET VENDOR */}
          <AccordionTab 
            header={
              <div className="accordion-header">
                <h2>Paramètres du compte</h2>
                <p className="settings-description">
                  {isVendor 
                    ? "Modifier votre mot de passe et voir vos informations de compte" 
                    : "Options pour modifier le nom d'utilisateur, le mot de passe"
                  }
                </p>
              </div>
            }
          >
            <div className="accordion-content">
              <div className="p-field">
                <label htmlFor="username">Nom d&apos;utilisateur</label>
                <InputText id="username" value={user?.username || ''} className="settings-input" disabled />
              </div>
              
              <div className="p-field">
                <label htmlFor="role">Rôle</label>
                <InputText 
                  id="role" 
                  value={isAdmin ? 'Administrateur' : 'Vendeur'} 
                  className="settings-input" 
                  disabled 
                />
              </div>

              {/* Afficher le nom du vendeur si c'est un vendor */}
              {isVendor && user?.seller_name && (
                <div className="p-field">
                  <label htmlFor="seller-name">Nom du vendeur</label>
                  <InputText 
                    id="seller-name" 
                    value={user.seller_name} 
                    className="settings-input" 
                    disabled 
                  />
                </div>
              )}
              
              <div className="p-field">
                <Button 
                  label="Changer le mot de passe" 
                  icon="pi pi-lock" 
                  className="p-button-secondary" 
                  onClick={() => setPasswordDialogVisible(true)}
                />
              </div>
            </div>
          </AccordionTab>
          

          
          {/* Création vendeur - ADMIN SEULEMENT */}
          {isAdmin && (
            <AccordionTab 
              header={
                <div className="accordion-header">
                  <h2>Création d&apos;un nouveau compte vendeur</h2>
                  <p className="settings-description">Nom d&apos;utilisateur, mot de passe généré aléatoirement, date de naissance</p>
                </div>
              }
            >
              <div className="accordion-content">
                <Button 
                  label="Créer un nouveau vendeur" 
                  icon="pi pi-user-plus" 
                  className="p-button-primary" 
                  onClick={openNewSellerDialog}
                  loading={loading}
                />
              </div>
            </AccordionTab>
          )}
        </Accordion>
      </div>
      
      {/* Dialog création vendeur - ADMIN SEULEMENT */}
      {isAdmin && (
        <Dialog 
          header="Création d'un nouveau compte vendeur" 
          visible={newSellerDialogVisible} 
          style={{ width: '500px' }} 
          onHide={() => setNewSellerDialogVisible(false)}
          footer={
            <div>
              <Button 
                label="Annuler" 
                icon="pi pi-times" 
                onClick={() => setNewSellerDialogVisible(false)} 
                className="p-button-text" 
              />
              <Button 
                label="Créer" 
                icon="pi pi-check" 
                onClick={handleCreateSeller} 
                className="p-button-primary"
                loading={loading}
              />
            </div>
          }
        >
          <div className="new-seller-form">
            <div className="p-field">
              <label htmlFor="seller-name">Nom et prénom</label>
              <InputText 
                id="seller-name" 
                value={sellerName} 
                onChange={(e) => setSellerName(e.target.value)} 
                placeholder="Ex: Jean Dupont" 
                className="w-full"
              />
              <small className="p-text-secondary">
                Username généré: {sellerName ? sellerName.toLowerCase().replace(' ', '.') : 'nom.prenom'}
              </small>
            </div>
            
            <div className="p-field">
              <label htmlFor="birth-date">Date de naissance</label>
              <Calendar 
                id="birth-date" 
                value={sellerBirthDate} 
                onChange={(e) => setSellerBirthDate(e.value as Date)} 
                showIcon
                placeholder="jj/mm/aaaa"
                dateFormat="dd/mm/yy"
                className="w-full"
              />
            </div>
            
            <div className="p-field">
              <label>Mot de passe généré</label>
              <div className="flex gap-2">
                <Password 
                  value={generatedPassword} 
                  toggleMask 
                  feedback={false}
                  className="flex-1"
                  inputClassName="w-full"
                  readOnly
                />
                <Button 
                  icon="pi pi-refresh" 
                  onClick={() => setGeneratedPassword(generateRandomPassword())}
                  className="p-button-secondary"
                  tooltip="Générer un nouveau mot de passe"
                />
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Dialog changement mot de passe - ADMIN ET VENDOR */}
      <Dialog 
        header="Changer le mot de passe" 
        visible={passwordDialogVisible} 
        style={{ width: '400px' }} 
        onHide={() => {
          setPasswordDialogVisible(false);
          setOldPassword('');
          setNewPassword('');
        }}
        footer={
          <div>
            <Button 
              label="Annuler" 
              icon="pi pi-times" 
              onClick={() => {
                setPasswordDialogVisible(false);
                setOldPassword('');
                setNewPassword('');
              }} 
              className="p-button-text" 
            />
            <Button 
              label="Modifier" 
              icon="pi pi-check" 
              onClick={handleChangePassword} 
              className="p-button-primary"
              loading={loading}
            />
          </div>
        }
      >
        <div className="password-change-form">
          {isVendor && (
            <div className="mb-3 p-3 bg-blue-50 border-round">
              <small className="text-600">
                <i className="pi pi-info-circle mr-1"></i>
                Utilisez votre mot de passe actuel généré par l&rsquo;administrateur
              </small>
            </div>
          )}
          
          <div className="p-field">
            <label htmlFor="old-password">Ancien mot de passe</label>
            <Password 
              id="old-password"
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)}
              feedback={false}
              className="w-full"
              inputClassName="w-full"
              placeholder={isVendor ? "Mot de passe généré par l&rsquo;admin" : "Votre ancien mot de passe"}
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="new-password">Nouveau mot de passe</label>
            <Password 
              id="new-password"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
              inputClassName="w-full"
              placeholder="Votre nouveau mot de passe"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserSettings;