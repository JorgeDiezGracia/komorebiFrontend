import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProject, getProjectById, updateProject } from '../services/projectService';
import { getSchools } from '../services/schoolService';
import { ODS_LIST } from '../constants/ods';

interface School {
  id: number;
  name: string;
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ods, setOds] = useState('');
  const [active, setActive] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    fetchSchools();
    if (isEditing) fetchProject();
  }, [id]);

  const fetchSchools = async () => {
    try {
      const response = await getSchools();
      setSchools(response.data);
    } catch {
      setError('Error loading schools');
    }
  };

  const fetchProject = async () => {
    try {
      const response = await getProjectById(Number(id));
      const project = response.data;
      setName(project.name);
      setDescription(project.description);
      setOds(project.ods.toString());
      setActive(project.active);
      setStartDate(project.startDate);
      setSchoolId(project.schoolId.toString());
    } catch {
      setError('Error loading project');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await updateProject(Number(id), {
          name, description, ods: parseInt(ods), active, startDate
        });
      } else {
        await createProject(Number(schoolId), {
          name, description, ods: parseInt(ods), active, startDate
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
        <h2>{isEditing ? 'Edit project' : 'New project'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>ODS</label>
            <select
                value={ods}
                onChange={(e) => setOds(e.target.value)}
            >
                <option value="">Select an ODS</option>
                {ODS_LIST.map(o => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Active project
            </label>
          </div>

          <div className="form-group">
            <label>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {!isEditing && (
            <div className="form-group">
              <label>School *</label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                required
              >
                <option value="">Select school</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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