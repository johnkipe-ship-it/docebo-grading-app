import React, { useEffect, useState } from 'react';
import {
  fetchSubmissions,
  fetchSubmission,
  updateSubmission,
  startLogin
} from './api';

/**
 * Simple Assignment Grading UI.
 *
 * On initial load it fetches a list of submissions.  If the API
 * responds with 401 it offers a login button.  Each row can be
 * expanded to show details and actions.  Approving or rejecting
 * updates the status immediately.
 */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);

  // Load submissions on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSubmissions();
        setSubmissions(data.items || data); // adapt to API shape
        setLoading(false);
      } catch (err) {
        if (err.message.includes('Not authenticated')) {
          setError('not_authenticated');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    }
    load();
  }, []);

  // When a submission is selected, fetch its details
  useEffect(() => {
    if (!selectedId) return;
    async function loadDetails() {
      try {
        const detail = await fetchSubmission(selectedId);
        setSelected(detail);
      } catch (err) {
        setError(err.message);
      }
    }
    loadDetails();
  }, [selectedId]);

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
    setSelected(null);
  };

  const handleUpdate = async (id, status) => {
    const feedback = prompt(
      `Enter feedback for ${status === 'approved' ? 'approval' : 'rejection'}:`
    );
    try {
      await updateSubmission(id, { status, feedback });
      // Refresh list after update
      const data = await fetchSubmissions();
      setSubmissions(data.items || data);
      setSelectedId(null);
      setSelected(null);
    } catch (err) {
      alert('Failed to update submission: ' + err.message);
    }
  };

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }

  if (error === 'not_authenticated') {
    return (
      <div className="p-4 space-y-2">
        <p>You need to log in to view assignments.</p>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded"
          onClick={startLogin}
        >
          Log in with Docebo
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assignment Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Course</th>
              <th className="p-2">Status</th>
              <th className="p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <React.Fragment key={s.id}>
                <tr
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelect(s.id)}
                >
                  <td className="p-2 border-t">{s.id}</td>
                  <td className="p-2 border-t">{s.user?.name || s.user_id}</td>
                  <td className="p-2 border-t">{s.course?.name || s.course_id}</td>
                  <td className="p-2 border-t capitalize">{s.status}</td>
                  <td className="p-2 border-t">{new Date(s.submitted_at).toLocaleString()}</td>
                </tr>
                {selectedId === s.id && selected && (
                  <tr>
                    <td colSpan="5" className="p-4 bg-gray-50">
                      <h2 className="text-lg font-semibold mb-2">Details</h2>
                      <p><strong>Description:</strong> {selected.description || '—'}</p>
                      {selected.file && (
                        <p>
                          <a
                            href={selected.file.download_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Download file
                          </a>
                        </p>
                      )}
                      <div className="mt-4 space-x-2">
                        {s.status === 'to_approve' && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-600 text-white rounded"
                              onClick={() => handleUpdate(s.id, 'approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded"
                              onClick={() => handleUpdate(s.id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {s.status !== 'to_approve' && (
                          <span>Status: {s.status}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}