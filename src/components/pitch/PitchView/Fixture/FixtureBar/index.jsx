import './FixtureBar.scss';

export default function FixtureBar({ fixtureId, category, stage }) {
  return (
    <div className="FixtureBar">
      <div className="fixture-id">
        <svg className="icon-larger" viewBox="0 0 24 24" width="24" height="24">
          <path d="M4 5h16v2H4V5m0 4h16v2H4V9m0 4h16v2H4v-2m0 4h16v2H4v-2z" />
        </svg>
        <span>{category}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-400">{`${fixtureId}`.padStart(2, '?').slice(-2)}</span>
      </div>
      
      
      <div className="stage">
        <span>{stage.substring(0,1)}</span>
      </div>
    </div>
  );
}
