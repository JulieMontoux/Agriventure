import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';

// composant création d'un nouveau vendeur

interface NewSellerDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (sellerData: SellerData) => void;
}

export interface SellerData {
  name: string;
  birthDate: Date | null;
  password: string;
}

const NewSellerDialog: React.FC<NewSellerDialogProps> = ({ visible, onHide, onSave }) => {
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [password, setPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    birthDate?: string;
  }>({});

  useEffect(() => {
    if (visible) {
      setName('');
      setBirthDate(null);
      setPassword(generateRandomPassword());
      setFormErrors({});
    }
  }, [visible]);

  const generateRandomPassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let generatedPassword = '';
    for (let i = 0; i < 12; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generatedPassword;
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      birthDate?: string;
    } = {};
    
    if (!name.trim()) {
      errors.name = 'Le nom est requis';
    }
    
    if (!birthDate) {
      errors.birthDate = 'La date de naissance est requise';
    } else {
      const today = new Date();
      const sixteenYearsAgo = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      
      if (birthDate > sixteenYearsAgo) {
        errors.birthDate = 'Le vendeur doit avoir au moins 16 ans';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name,
        birthDate,
        password
      });
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <Button 
          label="Annuler" 
          icon="pi pi-times" 
          onClick={onHide} 
          className="p-button-text" 
        />
        <Button 
          label="Créer" 
          icon="pi pi-check" 
          onClick={handleSubmit} 
          className="p-button-primary" 
          disabled={!name || !birthDate}
        />
      </div>
    );
  };

  return (
    <Dialog 
      header="Création d'un nouveau compte utilisateur" 
      visible={visible} 
      style={{ width: '500px' }} 
      onHide={onHide}
      footer={renderFooter()}
      closeOnEscape
      dismissableMask
    >
      <div className="new-seller-form">
        <div className="p-field">
          <label htmlFor="seller-name">Nom et prénom</label>
          <InputText 
            id="seller-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Saisissez votre texte..." 
            className={`w-full ${formErrors.name ? 'p-invalid' : ''}`}
          />
          {formErrors.name && <small className="p-error">{formErrors.name}</small>}
        </div>
        
        <div className="p-field">
          <label htmlFor="birth-date">Date de naissance</label>
          <Calendar 
            id="birth-date" 
            value={birthDate} 
            onChange={(e) => setBirthDate(e.value as Date)} 
            showIcon
            placeholder="../...."
            dateFormat="dd/mm/yy"
            className={`w-full ${formErrors.birthDate ? 'p-invalid' : ''}`}
            maxDate={new Date()} //ne permet pas les dates futures
          />
          {formErrors.birthDate && <small className="p-error">{formErrors.birthDate}</small>}
        </div>
        
        <div className="p-field">
          <label>Générer votre mot de passe</label>
          <Password 
            value={password} 
            toggleMask 
            feedback={false}
            className="w-full password-input"
            inputClassName="w-full"
            placeholder="Mot de passe"
            readOnly
          />
          <small className="form-helper-text">
            Ce mot de passe a été généré automatiquement. Veuillez le communiquer au vendeur.
          </small>
        </div>
      </div>
    </Dialog>
  );
};

export default NewSellerDialog;