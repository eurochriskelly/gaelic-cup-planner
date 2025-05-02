import './FixtureBar.scss';

export default function FixtureBar({ fixtureId, category, stage }) {
  return (
    <div className="FixtureBar">
      <div className="fixture-id">
        <svg className="icon-larger" viewBox="0 0 24 24" width="24" height="24">
          <path d="M4 5h16v2H4V5m0 4h16v2H4V9m0 4h16v2H4v-2m0 4h16v2H4v-2z" />
        </svg>
        <span>{`${fixtureId}`.padStart(3, '?').slice(-3)}</span>
      </div>
      
      <div className="category">
        <svg className="icon-larger" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
        </svg>
        <span>{category}</span>
      </div>
      
      <div className="stage">
        <svg className="icon-larger" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h2V7h2v4h2v2H7zm10 0h-2v-4h-2v4h-2v2h6z"/>
        </svg>
        <span>{stage}</span>
      </div>
    </div>
  );
}
