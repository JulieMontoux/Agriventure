type ProfileImageButtonProps = {
  imageUrl: string;
  onClick: () => void;
};

function ProfileImageButton({ imageUrl, onClick }: ProfileImageButtonProps) {
  return (
    <button onClick={onClick} className="p-0 border-none bg-transparent" style={{ cursor: 'pointer' }}>
      <img src={imageUrl} alt="Profil" className="border-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
    </button>
  );
}

export default ProfileImageButton;
