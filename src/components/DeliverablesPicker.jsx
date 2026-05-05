'use client';

const DELIVERABLES_BY_MEDIA = {
  photo: [
    { id: 'edited-images',   label: 'Edited Images',   defaultQty: 20 },
    { id: 'hero-shots',      label: 'Hero Shots',       defaultQty: 5  },
    { id: 'lifestyle-shots', label: 'Lifestyle Shots',  defaultQty: 10 },
    { id: 'product-shots',   label: 'Product Shots',    defaultQty: 10 },
    { id: 'bts-photos',      label: 'BTS Photos',       defaultQty: 10 },
    { id: 'social-crops',    label: 'Social Crops',     defaultQty: 5  },
    { id: 'headshots',       label: 'Headshots',        defaultQty: 5  },
    { id: 'detail-shots',    label: 'Detail / Macro',   defaultQty: 10 },
  ],
  video: [
    { id: 'hero-60',      label: '60-sec Hero Video', defaultQty: 1 },
    { id: 'hero-30',      label: '30-sec Cut',         defaultQty: 1 },
    { id: 'social-reels', label: 'Social Reels',       defaultQty: 3 },
    { id: 'bts-reel',     label: 'BTS Reel',           defaultQty: 1 },
    { id: 'interviews',   label: 'Interview Clips',    defaultQty: 2 },
    { id: 'product-demo', label: 'Product Demo',       defaultQty: 1 },
    { id: 'testimonial',  label: 'Testimonial',        defaultQty: 1 },
    { id: 'event-recap',  label: 'Event Recap',        defaultQty: 1 },
  ],
  'photo+video': [
    { id: 'edited-images', label: 'Edited Images',     defaultQty: 20 },
    { id: 'hero-shots',    label: 'Hero Shots',         defaultQty: 5  },
    { id: 'hero-60',       label: '60-sec Hero Video',  defaultQty: 1  },
    { id: 'hero-30',       label: '30-sec Cut',         defaultQty: 1  },
    { id: 'social-reels',  label: 'Social Reels',       defaultQty: 3  },
    { id: 'bts-content',   label: 'BTS Content',        defaultQty: 1  },
    { id: 'product-shots', label: 'Product Shots',      defaultQty: 10 },
    { id: 'social-crops',  label: 'Social Crops',       defaultQty: 5  },
  ],
};

export default function DeliverablesPicker({ mediaType, selected, onChange, color = 'blue' }) {
  const options = DELIVERABLES_BY_MEDIA[mediaType] || [];

  const toggle = (opt) => {
    const exists = selected.find((s) => s.id === opt.id);
    if (exists) {
      onChange(selected.filter((s) => s.id !== opt.id));
    } else {
      onChange([...selected, { id: opt.id, label: opt.label, qty: opt.defaultQty }]);
    }
  };

  const updateQty = (id, delta) => {
    onChange(
      selected.map((s) =>
        s.id === id ? { ...s, qty: Math.max(1, s.qty + delta) } : s
      )
    );
  };

  return (
    <div className="fcard">
      <div className="fcard-label">Deliverables</div>
      <p className="video-services-hint">Select everything included in this project</p>
      <div className="tags">
        {options.map((opt) => {
          const sel = selected.find((s) => s.id === opt.id);
          return (
            <button
              key={opt.id}
              className={`tag ${sel ? `sel-${color}` : ''}`}
              onClick={() => toggle(opt)}
            >
              {sel && <span style={{ marginRight: 4 }}>✓</span>}
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="deliverable-qty-list">
          {selected.map((s) => (
            <div className="deliverable-qty-row" key={s.id}>
              <span className="deliverable-qty-label">{s.label}</span>
              <div className="deliverable-qty-ctrl">
                <button
                  className="qty-btn"
                  onClick={() => updateQty(s.id, -1)}
                  aria-label="Decrease"
                >−</button>
                <span className="qty-val">{s.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQty(s.id, 1)}
                  aria-label="Increase"
                >+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to convert selected deliverables array → string for the API
export function serializeDeliverables(items) {
  return items.map((d) => `${d.qty} ${d.label}`).join(', ');
}
