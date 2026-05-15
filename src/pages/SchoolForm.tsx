import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSchool, getSchoolById, updateSchool } from '../services/schoolService';

export default function SchoolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [students, setStudents] = useState('');
  const [publicSchool, setPublicSchool] = useState(false);
  const [registerDate, setRegisterDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;

    const fetchSchool = async () => {
      try {
        const response = await getSchoolById(Number(id));
        const school = response.data;
        setName(school.name);
        setCity(school.city);
        setStudents(school.students.toString());
        setPublicSchool(school.publicSchool);
        setRegisterDate(school.registerDate);
      } catch {
        setError('Error loading school');
      } finally {
        setLoadingData(false);
      }
    };
    fetchSchool();
  }, [id]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await updateSchool(Number(id), {
          name, city, students: parseInt(students), publicSchool, registerDate
        });
      } else {
        await createSchool({
          name, city, students: parseInt(students), publicSchool, registerDate
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Invalid data, please check fields');
      } else if (err.response?.status === 404) {
        setError('School not found');
      } else {
        setError("Error: can't connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <div className="state-msg">Loading...</div>;

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>{isEditing ? 'Edit school' : 'New school'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="School name"
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>

          <div className="form-group">
            <label>Number of students</label>
            <input
              type="number"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              placeholder="Number of students"
              min="1"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={publicSchool}
                onChange={(e) => setPublicSchool(e.target.checked)}
              />
              Public school
            </label>
          </div>

          <div className="form-group">
            <label>Register date</label>
            <input
              type="date"
              value={registerDate}
              onChange={(e) => setRegisterDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save changes' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}