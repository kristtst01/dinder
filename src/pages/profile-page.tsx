import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Edit your profile bigboy</h1>
      <button
        className="gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-700 font-medium"
        onClick={() => navigate('/')}
      >
        Back
      </button>
    </div>
  );
}

export default ProfilePage;
