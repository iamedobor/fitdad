import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { compressImage } from '../../utils/image.js';

export function PhotosView() {
  const { photos, setPhotos, todayKey } = useApp();
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const entry = {
        date: todayKey,
        label: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        data: compressed,
      };
      const updated = [...photos, entry];
      setPhotos(updated);
    } catch {
      alert('Could not save photo. Please try again.');
    }
    e.target.value = '';
  };

  const remove = (idx) => {
    if (!confirm('Remove this photo?')) return;
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        onClick={() => fileRef.current.click()}
        role="button"
        aria-label="Add progress photo"
        style={{ background: 'var(--bg2)', border: '1px dashed var(--border2)', borderRadius: 'var(--r)', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
      >
        <Camera size={24} color="var(--text3)" style={{ margin: '0 auto 8px' }} />
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>Add progress photo</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Stored locally on this device only</div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {photos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}>No photos yet.</div>
          <div style={{ fontSize: 11 }}>One photo every two to four weeks shows real change.</div>
          <div style={{ fontSize: 11, marginTop: 3 }}>The camera does not lie. Use it to your advantage.</div>
        </div>
      )}

      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[...photos].reverse().map((p, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '1' }}>
              <img src={p.data} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 8px 6px', background: 'linear-gradient(transparent,rgba(0,0,0,0.75))' }}>
                <div style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>{p.label}</div>
              </div>
              <button
                onClick={() => remove(photos.length - 1 - i)}
                aria-label="Remove photo"
                style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
