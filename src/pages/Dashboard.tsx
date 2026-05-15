import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../services/projectService';
import { getSchools, deleteSchool } from '../services/schoolService';

interface School {
  id: number;
  name: string;
  city: string;
  students: number;
  publicSchool: boolean;
  registerDate: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  ods: number;
  active: boolean;
  startDate: string;
  schoolId: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [schools, setSchools] = useState<School[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorSchools, setErrorSchools] = useState('');
  const [errorProjects, setErrorProjects] = useState('');

  // Filters schools
  const [filterSchoolName, setFilterSchoolName] = useState('');
  const [filterSchoolCity, setFilterSchoolCity] = useState('');
  const [schoolDateFrom, setSchoolDateFrom] = useState('');
  const [schoolDateTo, setSchoolDateTo] = useState('');



  // Filters projects
  const [filterProjectName, setFilterProjectName] = useState('');
  const [projectDateFrom, setProjectDateFrom] = useState('');
  const [projectDateTo, setProjectDateTo] = useState('');

  // Sorting
  const [schoolSortField, setSchoolSortField] = useState<keyof School>('name');
  const [schoolSortAsc, setSchoolSortAsc] = useState(true);
  const [projectSortField, setProjectSortField] = useState<keyof Project>('name');
  const [projectSortAsc, setProjectSortAsc] = useState(true);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchSchools();
    fetchProjects();
  }, []);

  const fetchSchools = async () => {
    setLoadingSchools(true);
    setErrorSchools('');
    try {
      const response = await getSchools();
      setSchools(response.data);
    } catch {
      setErrorSchools('Error loading schools');
    } finally {
      setLoadingSchools(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    setErrorProjects('');
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch {
      setErrorProjects('Error loading projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteSchool = async (id: number) => {
  if (!window.confirm('Are you sure you want to delete this school?')) return;
  
  try {
    await deleteSchool(id);
    fetchSchools();
  } catch (err: any) {
    if (err.response?.status === 404) {
      alert('School not found');
    } else {
      alert("Error: can't delete the selected school");
    }
  }
};

const handleDeleteProject = async (id: number) => {
  if (!window.confirm('Are you sure you want to delete this project?')) return;

  try {
    await deleteProject(id);
    fetchProjects();
  } catch (err: any) {
    if (err.response?.status === 404) {
      alert('Project not found');
    } else {
      alert("Error: can't delete the selected project");
    }
  }
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format Date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Filter and sorting schools
  const filteredSchools = schools
  .filter(s =>
    s.name.toLowerCase().includes(filterSchoolName.toLowerCase()) &&
    s.city.toLowerCase().includes(filterSchoolCity.toLowerCase()) &&
    (schoolDateFrom === '' || s.registerDate >= schoolDateFrom) &&
    (schoolDateTo === '' || s.registerDate <= schoolDateTo)
  )
  .sort((a, b) => {
    const valA = a[schoolSortField];
    const valB = b[schoolSortField];
    if (valA < valB) return schoolSortAsc ? -1 : 1;
    if (valA > valB) return schoolSortAsc ? 1 : -1;
    return 0;
  });

  // Filter and sorting projects
  const filteredProjects = projects
  .filter(p =>
    p.name.toLowerCase().includes(filterProjectName.toLowerCase()) &&
    (projectDateFrom === '' || p.startDate >= projectDateFrom) &&
    (projectDateTo === '' || p.startDate <= projectDateTo)
  )
  .sort((a, b) => {
    const valA = a[projectSortField];
    const valB = b[projectSortField];
    if (valA < valB) return projectSortAsc ? -1 : 1;
    if (valA > valB) return projectSortAsc ? 1 : -1;
    return 0;
  });

  const toggleSchoolSort = (field: keyof School) => {
    if (schoolSortField === field) {
      setSchoolSortAsc(!schoolSortAsc);
    } else {
      setSchoolSortField(field);
      setSchoolSortAsc(true);
    }
  };

  const toggleProjectSort = (field: keyof Project) => {
    if (projectSortField === field) {
      setProjectSortAsc(!projectSortAsc);
    } else {
      setProjectSortField(field);
      setProjectSortAsc(true);
    }
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Komorebi</h1>
        <div className="header-right">
          <span>Hi, {user?.username} ({isAdmin ? 'Admin' : 'Usuario'})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* SUMMARY */}
      <section className="summary">
        <div className="summary-card">
          <h3>Schools</h3>
          <p className="summary-number">{schools.length}</p>
        </div>
        <div className="summary-card">
          <h3>Projects</h3>
          <p className="summary-number">{projects.length}</p>
        </div>
        <div className="summary-card">
          <h3>Active Projects</h3>
          <p className="summary-number">{projects.filter(p => p.active).length}</p>
        </div>
        {isAdmin && (
          <div className="summary-card admin">
            <h3>Role</h3>
            <p className="summary-number">ADMIN</p>
          </div>
        )}
      </section>

      {/* SCHOOLS TABLE */}
      <section className="table-section">
        <div className="table-header">
          <h2>Schools</h2>
          {isAdmin && (
            <button className="btn-add" onClick={() => navigate('/schools/new')}>
              + Add school
            </button>
          )}
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={filterSchoolName}
            onChange={(e) => setFilterSchoolName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by city..."
            value={filterSchoolCity}
            onChange={(e) => setFilterSchoolCity(e.target.value)}
          />
          <input
            type="date"
            value={schoolDateFrom}
            onChange={(e) => setSchoolDateFrom(e.target.value)}
            title="Desde"
          />
          <input
            type="date"
            value={schoolDateTo}
            onChange={(e) => setSchoolDateTo(e.target.value)}
            title="Hasta"
          />
        </div>

        {loadingSchools && <div className="state-msg">Loading...</div>}
        {errorSchools && <div className="state-msg error">{errorSchools}</div>}
        {!loadingSchools && !errorSchools && filteredSchools.length === 0 && (
          <div className="state-msg">Schools not found</div>
        )}

        {!loadingSchools && !errorSchools && filteredSchools.length > 0 && (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSchoolSort('name')}>
                  Name {schoolSortField === 'name' ? (schoolSortAsc ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => toggleSchoolSort('city')}>
                  City {schoolSortField === 'city' ? (schoolSortAsc ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => toggleSchoolSort('students')}>
                  Students {schoolSortField === 'students' ? (schoolSortAsc ? '↑' : '↓') : ''}
                </th>
                <th>Public</th>
                <th onClick={() => toggleSchoolSort('registerDate')}>
                  Register Date {schoolSortField === 'registerDate' ? (schoolSortAsc ? '↑' : '↓') : ''}
                </th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map(school => (
                <tr key={school.id}>
                  <td>{school.name}</td>
                  <td>{school.city}</td>
                  <td>{school.students}</td>
                  <td>{school.publicSchool ? 'Yes' : 'No'}</td>
                  <td>{formatDate(school.registerDate)}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => navigate(`/schools/edit/${school.id}`)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteSchool(school.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* PROJECTS TABLE*/}
      <section className="table-section">
        <div className="table-header">
          <h2>Projects</h2>
          {isAdmin && (
            <button className="btn-add" onClick={() => navigate('/projects/new')}>
              + Add project
            </button>
          )}
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={filterProjectName}
            onChange={(e) => setFilterProjectName(e.target.value)}
          />
          <input
            type="date"
            value={projectDateFrom}
            onChange={(e) => setProjectDateFrom(e.target.value)}
            title="Desde"
          />
          <input
            type="date"
            value={projectDateTo}
            onChange={(e) => setProjectDateTo(e.target.value)}
            title="Hasta"
          />
        </div>

        {loadingProjects && <div className="state-msg">Loading...</div>}
        {errorProjects && <div className="state-msg error">{errorProjects}</div>}
        {!loadingProjects && !errorProjects && filteredProjects.length === 0 && (
          <div className="state-msg">Projects not found</div>
        )}

        {!loadingProjects && !errorProjects && filteredProjects.length > 0 && (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleProjectSort('name')}>
                  Name {projectSortField === 'name' ? (projectSortAsc ? '↑' : '↓') : ''}
                </th>
                <th>Description</th>
                <th onClick={() => toggleProjectSort('ods')}>
                  ODS {projectSortField === 'ods' ? (projectSortAsc ? '↑' : '↓') : ''}
                </th>
                <th>Active</th>
                <th onClick={() => toggleProjectSort('startDate')}>
                  Start Date {projectSortField === 'startDate' ? (projectSortAsc ? '↑' : '↓') : ''}
                </th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>{project.ods}</td>
                  <td>{project.active ? 'Yes' : 'No'}</td>
                  <td>{formatDate(project.startDate)}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => navigate(`/projects/edit/${project.id}`)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteProject(project.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}