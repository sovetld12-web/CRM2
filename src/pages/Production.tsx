import { useState } from 'react';
import { useData, Project } from '../contexts/DataContext';
import ProjectCard from '../components/ProjectCard';

export default function Production() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [filters, setFilters] = useState({
    client: '',
    project: '',
    sum: '',
    comment: '',
  });

  const filteredProjects = projects.filter(p => {
    if (filters.client && !p.client.toLowerCase().includes(filters.client.toLowerCase())) return false;
    if (filters.project && !p.vacancy.toLowerCase().includes(filters.project.toLowerCase())) return false;
    if (filters.sum && p.sum < parseFloat(filters.sum)) return false;
    if (filters.comment && !(p.comment || '').toLowerCase().includes(filters.comment.toLowerCase())) return false;
    return true;
  });

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (selectedProject?.id) {
      updateProject(selectedProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setShowCard(false);
    setSelectedProject(null);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setShowCard(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowCard(true);
  };

  const handleDuplicateProject = (project: Project) => {
    const newProject: Omit<Project, 'id'> = {
      ...project,
      startDate: new Date().toISOString().split('T')[0],
      status: 'В работе',
    };
    addProject(newProject);
  };

  const handlePauseProject = (project: Project) => {
    const reason = prompt('Причина паузы:');
    if (reason) {
      updateProject(project.id, {
        status: 'На паузе',
        comment: `${project.comment || ''}\n[ПАУЗА] ${new Date().toLocaleDateString('ru-RU')}: ${reason}`,
      });
    }
  };

  const handleCompleteProject = (project: Project) => {
    if (confirm(`Завершить проект "${project.vacancy}" для клиента ${project.client}?`)) {
      updateProject(project.id, {
        status: 'Закрыт',
        endDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleDeleteProject = (project: Project) => {
    if (confirm(`Удалить проект "${project.vacancy}" для клиента ${project.client}?`)) {
      deleteProject(project.id);
    }
  };

  const calculateDays = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateFirstCandidateDays = (startDate: string, firstCandidateDate?: string) => {
    if (!firstCandidateDate) return null;
    const start = new Date(startDate);
    const first = new Date(firstCandidateDate);
    const diffTime = Math.abs(first.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Производство</h1>
          <p className="text-sm text-slate-400 mt-1">Активные проекты и вакансии в работе</p>
        </div>
        <button onClick={handleNewProject} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Новый проект
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'В работе').length}</p>
          <p className="text-xs text-slate-400 mt-1">Активных проектов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{projects.filter(p => p.status === 'В работе' && p.days > 30).length}</p>
          <p className="text-xs text-slate-400 mt-1">Просрочено 30+ дней</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{(projects.filter(p => p.status === 'В работе').reduce((acc, p) => acc + p.sum, 0) / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Потенциал ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{projects.filter(p => p.status === 'Закрыт').length}</p>
          <p className="text-xs text-slate-400 mt-1">Закрыто</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Поиск по клиенту..."
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Поиск по проекту..."
            value={filters.project}
            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <input
            type="number"
            placeholder="Сумма от..."
            value={filters.sum}
            onChange={(e) => setFilters({ ...filters, sum: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Поиск в комментариях..."
            value={filters.comment}
            onChange={(e) => setFilters({ ...filters, comment: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left p-3 font-medium">Дата старта</th>
              <th className="text-left p-3 font-medium">Клиент</th>
              <th className="text-left p-3 font-medium">Проект / вакансия</th>
              <th className="text-left p-3 font-medium">1-й кандидат</th>
              <th className="text-center p-3 font-medium">Срок</th>
              <th className="text-left p-3 font-medium">Оффер</th>
              <th className="text-left p-3 font-medium">Выход</th>
              <th className="text-center p-3 font-medium">Дней</th>
              <th className="text-center p-3 font-medium">Норма</th>
              <th className="text-right p-3 font-medium">Сумма</th>
              <th className="text-right p-3 font-medium">Ожидание</th>
              <th className="text-right p-3 font-medium">Маржа</th>
              <th className="text-left p-3 font-medium">Комментарий</th>
              <th className="text-center p-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => {
              const days = calculateDays(project.startDate, project.status === 'Закрыт' ? project.endDate : undefined);
              const firstCandidateDays = calculateFirstCandidateDays(project.startDate, project.firstCandidateDate);
              const expectedPayment = project.sum - (project.paid || 0);
              const margin = project.sum - (project.directCosts || 0);

              return (
                <tr key={project.id} className="table-row border-b border-slate-700/30">
                  <td className="p-3 text-slate-400 text-xs">{project.startDate}</td>
                  <td className="p-3 text-white font-medium">{project.client}</td>
                  <td className="p-3 text-slate-300">{project.vacancy}</td>
                  <td className="p-3 text-slate-400 text-xs">
                    {project.firstCandidateDate || '—'}
                    {firstCandidateDays && (
                      <span className="ml-1 text-indigo-400">({firstCandidateDays} дн.)</span>
                    )}
                  </td>
                  <td className="p-3 text-center text-slate-400 text-xs">
                    {project.closingNorm || 30} дн.
                  </td>
                  <td className="p-3 text-slate-400 text-xs">{project.offerDate || '—'}</td>
                  <td className="p-3 text-slate-400 text-xs">{project.workStartDate || '—'}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${days > (project.closingNorm || 30) ? 'text-red-400' : 'text-emerald-400'}`}>
                      {days}
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-500 text-xs">
                    {project.closingNorm || 30}
                  </td>
                  <td className="p-3 text-right text-white font-medium">{project.sum.toLocaleString('ru-RU')} ₽</td>
                  <td className="p-3 text-right text-indigo-400 font-medium">{expectedPayment.toLocaleString('ru-RU')} ₽</td>
                  <td className="p-3 text-right text-emerald-400 font-medium">{margin.toLocaleString('ru-RU')} ₽</td>
                  <td className="p-3 text-slate-400 text-xs max-w-[200px] truncate" title={project.comment}>
                    {project.comment || '—'}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleDuplicateProject(project)}
                        className="text-xs text-slate-400 hover:text-slate-300"
                        title="Дублировать"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                        title="Редактировать"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {project.status === 'В работе' && (
                        <button
                          onClick={() => handlePauseProject(project)}
                          className="text-xs text-amber-400 hover:text-amber-300"
                          title="Пауза"
                        >
                          <i className="fas fa-pause"></i>
                        </button>
                      )}
                      {project.status === 'В работе' && (
                        <button
                          onClick={() => handleCompleteProject(project)}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                          title="Завершить"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="text-xs text-red-400 hover:text-red-300"
                        title="Удалить"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <i className="fas fa-inbox text-4xl mb-3 opacity-30"></i>
            <p>Нет проектов</p>
          </div>
        )}
      </div>

      {/* Project Card Modal */}
      {showCard && (
        <ProjectCard
          project={selectedProject}
          onClose={() => {
            setShowCard(false);
            setSelectedProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}
