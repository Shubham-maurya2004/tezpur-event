import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { liveScoreAPI, eventAPI } from '../services/api';
import { LiveScore, Event } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import TopNav from '../components/TopNav';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Dialog } from '../components/ui/dialog';
import { Alert } from '../components/ui/alert';
import { Select } from '../components/ui/select';

const LiveScores: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [scores, setScores] = useState<LiveScore[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<LiveScore | null>(null);
  const [form, setForm] = useState({
    eventId: '', eventName: '', matchTitle: '',
    team1Name: '', team1Score: 0, team2Name: '', team2Score: 0, currentStatus: 'ongoing',
  });
  const [editForm, setEditForm] = useState<any>({
    team1: { name: '', score: 0 }, team2: { name: '', score: 0 }, currentStatus: 'ongoing',
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [scoreRes, eventRes] = await Promise.all([liveScoreAPI.getAll(), eventAPI.getAll()]);
      setScores(scoreRes.data);
      setEvents(eventRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      const selectedEvent = events.find((e) => e._id === form.eventId);
      await liveScoreAPI.create({
        eventId: form.eventId,
        eventName: form.eventName || selectedEvent?.name || '',
        matchTitle: form.matchTitle,
        team1: { name: form.team1Name, score: form.team1Score, players: [] },
        team2: { name: form.team2Name, score: form.team2Score, players: [] },
        currentStatus: form.currentStatus,
      });
      setMessage('Score created');
      setShowCreate(false);
      fetchData();
    } catch { setMessage('Create failed'); }
  };

  const handleUpdate = async () => {
    if (!showEdit) return;
    try {
      await liveScoreAPI.update(showEdit._id, editForm);
      setMessage('Score updated');
      setShowEdit(null);
      fetchData();
    } catch { setMessage('Update failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this score?')) return;
    try {
      await liveScoreAPI.delete(id);
      setMessage('Score deleted');
      fetchData();
    } catch { setMessage('Delete failed'); }
  };

  const handleEventChange = (eid: string) => {
    const evt = events.find((e) => e._id === eid);
    setForm({ ...form, eventId: eid, eventName: evt?.name || '' });
  };

  const Content = () => (
    <div className={isAdmin ? '' : 'max-w-6xl mx-auto px-4 py-8'}>
      {!isAdmin && (
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">Live Scores</h1>
          <p className="text-gray-500">Real-time event scores and updates</p>
        </div>
      )}
      {isAdmin && (
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">Live Scores</h1>
          <p className="text-gray-500">Manage live scores for events</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">Create Score Entry</button>
        </div>
      )}
      {message && <Alert variant="info" className="mb-4">{message}</Alert>}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : scores.length === 0 ? (
        <p className="text-gray-500">No live scores available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scores.map((s) => (
            <Card key={s._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{s.matchTitle}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{s.eventName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    s.currentStatus === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>{s.currentStatus}</span>
                </div>
              </CardHeader>
              <CardContent>
                {(s.team1?.name || s.team2?.name) ? (
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <p className="font-semibold text-navy-700">{s.team1.name}</p>
                      <p className="text-3xl font-bold text-navy-800">{s.team1.score}</p>
                    </div>
                    <div className="text-gray-400 font-bold text-xl px-4">VS</div>
                    <div className="text-center flex-1">
                      <p className="font-semibold text-navy-700">{s.team2.name}</p>
                      <p className="text-3xl font-bold text-navy-800">{s.team2.score}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {s.individualScores?.map((ind, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{ind.studentName}</span>
                        <span className="text-sm font-bold text-navy-700">{ind.score} pts</span>
                      </div>
                    ))}
                  </div>
                )}
                {isAdmin && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => { setShowEdit(s); setEditForm({ team1: s.team1, team2: s.team2, currentStatus: s.currentStatus }); }} className="btn-primary text-xs">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="btn-danger text-xs">Delete</button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="Create Live Score">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Event</label>
            <select value={form.eventId} onChange={(e) => handleEventChange(e.target.value)} className="input-field">
              <option value="">Select event...</option>
              {events.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-navy-700 mb-1">Match Title</label><input value={form.matchTitle} onChange={(e) => setForm({...form, matchTitle: e.target.value})} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Team 1 Name</label><input value={form.team1Name} onChange={(e) => setForm({...form, team1Name: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Team 1 Score</label><input type="number" value={form.team1Score} onChange={(e) => setForm({...form, team1Score: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Team 2 Name</label><input value={form.team2Name} onChange={(e) => setForm({...form, team2Name: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Team 2 Score</label><input type="number" value={form.team2Score} onChange={(e) => setForm({...form, team2Score: Number(e.target.value)})} className="input-field" /></div>
          </div>
          <button onClick={handleCreate} className="btn-primary w-full">Create Score</button>
        </div>
      </Dialog>

      <Dialog open={!!showEdit} onClose={() => setShowEdit(null)} title="Update Score">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Team 1 Score</label><input type="number" value={editForm.team1?.score || 0} onChange={(e) => setEditForm({...editForm, team1: {...editForm.team1, score: Number(e.target.value)}})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Team 2 Score</label><input type="number" value={editForm.team2?.score || 0} onChange={(e) => setEditForm({...editForm, team2: {...editForm.team2, score: Number(e.target.value)}})} className="input-field" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
            <select value={editForm.currentStatus} onChange={(e) => setEditForm({...editForm, currentStatus: e.target.value})} className="input-field">
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button onClick={handleUpdate} className="btn-primary w-full">Update Score</button>
        </div>
      </Dialog>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
          <Content />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <Content />
    </div>
  );
};

export default LiveScores;
