import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Plus, Edit2, Trash2, X, Upload, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import './Admin.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', tagline: '', platform: '', impact: '',
    stack: '', bullets: '',
    is_highlight: false, is_hero: false,
    screenshots: [],
    hero_selection: []
  });
  const [uploading, setUploading] = useState(false);

  // Auth Check
  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        navigate('/admin');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
      } else {
        fetchProjects();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      // It's possible the table doesn't exist yet, we just show empty array.
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title || '',
        tagline: project.tagline || '',
        platform: project.platform || '',
        impact: project.impact || '',
        stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
        bullets: Array.isArray(project.bullets) ? project.bullets.join('\n') : '',
        is_highlight: project.is_highlight || false,
        is_hero: project.is_hero || false,
        screenshots: project.screenshots || [],
        hero_selection: project.hero_selection || []
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', tagline: '', platform: '', impact: '',
        stack: '', bullets: '', is_highlight: false, is_hero: false, screenshots: [], hero_selection: []
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(filePath);

        newUrls.push(publicUrlData.publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, ...newUrls]
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Make sure the portfolio-media bucket exists and is public.');
    } finally {
      setUploading(false);
    }
  };

  const toggleHeroSelection = (url) => {
    setFormData(prev => {
      const isSelected = prev.hero_selection.includes(url);
      if (isSelected) {
        return { ...prev, hero_selection: prev.hero_selection.filter(u => u !== url) };
      } else {
        if (prev.hero_selection.length >= 2) {
          alert("Maximum 2 hero screenshots allowed. Deselect one first.");
          return prev;
        }
        return { ...prev, hero_selection: [...prev.hero_selection, url] };
      }
    });
  };

  const removeImage = (indexToRemove) => {
    const urlToRemove = formData.screenshots[indexToRemove];
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, idx) => idx !== indexToRemove),
      hero_selection: prev.hero_selection.filter(url => url !== urlToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        tagline: formData.tagline,
        platform: formData.platform,
        impact: formData.impact,
        stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean),
        bullets: formData.bullets.split('\n').map(s => s.trim()).filter(Boolean),
        is_highlight: formData.is_highlight,
        is_hero: formData.is_hero,
        screenshots: formData.screenshots,
        hero_selection: formData.hero_selection,
      };

      if (editingId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save project. Ensure table schema matches.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          <CheckCircle2 color="var(--accent-blue)" />
          <span>Admin Dashboard</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" data-cursor="pointer">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <main className="admin-content">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2>Manage Projects</h2>
          <button onClick={() => openModal()} className="add-btn" data-cursor="pointer">
            <Plus size={18} /> Add Project
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
            <Loader2 size={20} className="spinner" /> Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No projects found in database.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>The website is currently using fallback hardcoded data.</p>
          </div>
        ) : (
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {projects.map(project => (
              <div key={project.id} className="admin-project-card" data-cursor="expand" onClick={() => openModal(project)}>
                <div className="project-card-image" style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  {project.screenshots?.[0] ? (
                    <img src={project.screenshots[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                      <ImageIcon size={48} color="rgba(255,255,255,0.1)" />
                    </div>
                  )}
                  <div className="project-badges" style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                    {project.is_highlight && (
                      <span className="badge highlight" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        Highlight
                      </span>
                    )}
                    {project.is_hero && (
                      <span className="badge hero" style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        Hero Item
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="project-card-content" style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 24px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.tagline}
                  </p>
                  
                  <div className="project-card-actions" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={(e) => { e.stopPropagation(); openModal(project); }} className="action-btn" data-cursor="pointer" style={{ flex: 1 }}>
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} className="action-btn delete" data-cursor="pointer" style={{ flex: 1 }}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingId ? 'Refine Project' : 'New Project'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="close-btn" 
                data-cursor="pointer"
                style={{ background: 'none', border: 'none', color: '#64748b' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Section: Identity */}
              <section className="form-section">
                <div className="section-header">
                  <h4>Identity & Context</h4>
                  <div className="section-line" />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      placeholder="e.g. FlowMusic"
                      data-cursor="text"
                    />
                  </div>
                  <div className="form-group">
                    <label>Platform & Year</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Flutter · 2024" 
                      value={formData.platform} 
                      onChange={e => setFormData({...formData, platform: e.target.value})} 
                      data-cursor="text"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Elevator Pitch / Tagline</label>
                  <input 
                    type="text" 
                    value={formData.tagline} 
                    onChange={e => setFormData({...formData, tagline: e.target.value})} 
                    placeholder="Short, punchy description..."
                    data-cursor="text"
                  />
                </div>
              </section>

              {/* Section: Content */}
              <section className="form-section">
                <div className="section-header">
                  <h4>Technical & Impact</h4>
                  <div className="section-line" />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Impact Metric</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 10k+ active users" 
                      value={formData.impact} 
                      onChange={e => setFormData({...formData, impact: e.target.value})} 
                      data-cursor="text"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tech Stack</label>
                    <input 
                      type="text" 
                      placeholder="Flutter, Supabase, GSAP" 
                      value={formData.stack} 
                      onChange={e => setFormData({...formData, stack: e.target.value})} 
                      data-cursor="text"
                    />
                    <span className="helper-text">Comma separated list</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Key Achievements & Features</label>
                  <textarea 
                    placeholder="Implemented real-time sync&#10;Reduced latency by 40%" 
                    value={formData.bullets} 
                    onChange={e => setFormData({...formData, bullets: e.target.value})} 
                    data-cursor="text"
                  />
                  <span className="helper-text">One point per line</span>
                </div>
              </section>

              {/* Section: Display Options */}
              <section className="form-section">
                <div className="section-header">
                  <h4>Visibility Settings</h4>
                  <div className="section-line" />
                </div>
                
                <div className="checkbox-row">
                  <label className="checkbox-card" data-cursor="pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_highlight} 
                      onChange={e => setFormData({...formData, is_highlight: e.target.checked})} 
                    />
                    <div className="checkbox-text">
                      <h5>Top Highlight</h5>
                      <p>Feature this project in the top 3 cards on the homepage.</p>
                    </div>
                  </label>
                  
                  <label className="checkbox-card" data-cursor="pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_hero} 
                      onChange={e => setFormData({...formData, is_hero: e.target.checked})} 
                    />
                    <div className="checkbox-text">
                      <h5>Hero Display</h5>
                      <p>Inject these screenshots into the 3D phone mockups.</p>
                    </div>
                  </label>
                </div>
              </section>

              {/* Section: Media */}
              <section className="form-section">
                <div className="section-header">
                  <h4>Visual Assets</h4>
                  <div className="section-line" />
                </div>
                
                <div className="media-section">
                  <div className="media-upload-area" onClick={() => document.getElementById('media-upload').click()} data-cursor="pointer">
                    <Upload className="upload-icon" size={24} style={{ marginBottom: '12px', color: 'var(--accent-blue)' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>Upload Project Media</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Supports PNG, JPG, WebP</div>
                    <input 
                      id="media-upload" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </div>
                  
                  {uploading && (
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                      <Loader2 size={16} className="spinner" /> 
                      Synchronizing with Supabase...
                    </div>
                  )}
                  
                  {formData.screenshots.length > 0 && (
                    <div className="preview-grid">
                      {formData.screenshots.map((url, idx) => {
                        const isHero = formData.hero_selection.includes(url);
                        const heroIndex = formData.hero_selection.indexOf(url);
                        
                        return (
                          <div 
                            key={idx} 
                            className={`preview-item ${isHero ? 'is-hero-selected' : ''}`}
                            onClick={() => toggleHeroSelection(url)}
                            data-cursor="pointer"
                          >
                            <img src={url} alt={`Screenshot ${idx}`} />
                            {isHero && (
                              <div className="hero-order-badge">
                                Hero {heroIndex + 1}
                              </div>
                            )}
                            <button 
                              type="button" 
                              className="remove-btn" 
                              onClick={(e) => { e.stopPropagation(); removeImage(idx); }} 
                              data-cursor="pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="cancel-btn" 
                data-cursor="pointer"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSave} 
                className="save-btn" 
                disabled={uploading} 
                data-cursor="pointer"
              >
                {editingId ? 'Update Project' : 'Launch Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
