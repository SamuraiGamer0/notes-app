export default function TopBar({ search, onSearchChange, onNewNote }) {
  return (
    <header className="topbar">
      <h1 className="topbar__title">Notas</h1>

      <div className="topbar__search">
        <svg
          className="topbar__search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line
            x1="16.65"
            y1="16.65"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título"
          aria-label="Buscar notas por título"
        />
      </div>

      <button type="button" className="btn btn--primary" onClick={onNewNote}>
        Nueva nota
      </button>
    </header>
  );
}
