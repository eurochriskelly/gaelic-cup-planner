const ROW_WIDTHS = {
    score: 50,
    child: 38,
    knockout: 60,
    minTeam: 60,
    maxTeam: 420
};

class FixtureRow extends HTMLElement {
  static get observedAttributes() {
    return [
      'team1', 'team1-goals', 'team1-points',
      'team2', 'team2-goals', 'team2-points',
      'outcome', 'match-id', 'stage', 'stage-level', 'category', 'debug'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const team1 = this.getAttribute('team1') || '';
    const team2 = this.getAttribute('team2') || '';
    const team1Goals = parseInt(this.getAttribute('team1-goals') || '0', 10);
    const team1Points = parseInt(this.getAttribute('team1-points') || '0', 10);
    const team2Goals = parseInt(this.getAttribute('team2-goals') || '0', 10);
    const team2Points = parseInt(this.getAttribute('team2-points') || '0', 10);
    const outcome = this.getAttribute('outcome') || '';
    const matchId = this.getAttribute('match-id') || '';
    const stage = this.getAttribute('stage') || '';
    const stageLevel = this.getAttribute('stage-level') || '';
    const category = this.getAttribute('category') || '';
    const debug = this.hasAttribute('debug');
      const rowIndex = parseInt(this.getAttribute('row-index'), 10);
      const bgColor = !isNaN(rowIndex) && rowIndex % 2 === 0 ? '#f9fafb' : '#fff'; // gray-50 or white

    // Calculate total scores
    const team1Total = team1Goals * 3 + team1Points;
    const team2Total = team2Goals * 3 + team2Points;
    let team1Winner = false, team2Winner = false;
    if (outcome === 'played') {
      if (team1Total > team2Total) team1Winner = true;
      else if (team2Total > team1Total) team2Winner = true;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .row {
          display: grid;
          grid-template-columns:
            1fr /* team1 */
            ${ROW_WIDTHS.score}px /* score1 */
            var(--fixture-row-child-width, ${ROW_WIDTHS.child}px) /* child1 */
            ${ROW_WIDTHS.knockout}px /* knockout-level */
            var(--fixture-row-child-width, ${ROW_WIDTHS.child}px) /* child2 */
            ${ROW_WIDTHS.score}px /* score2 */
            1fr /* team2 */;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          min-height: 48px;
          background: var(--fixture-row-bg, ${bgColor});
          border-radius: 6px;
          box-shadow: var(--fixture-row-shadow, none);
          padding-top: 1.2rem;
          padding-bottom: 1.2rem;
        }
        .team1 {
          min-width: ${ROW_WIDTHS.minTeam}px;
          max-width: ${ROW_WIDTHS.maxTeam}px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
          justify-self: stretch;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          ${debug ? 'background: #ffe0e0;' : ''}
        }
        .team2 {
          min-width: ${ROW_WIDTHS.minTeam}px;
          max-width: ${ROW_WIDTHS.maxTeam}px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-self: stretch;
          ${debug ? 'background: #e0e0ff;' : ''}
        }
        .score {
          justify-self: center;
          display: flex;
          text-align: center;
          align-items: center;
          justify-content: center;
          height: 100%;
          ${debug ? 'background: #e0ffe0;' : ''}
        }
        .center {
          justify-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          ${debug ? 'background: #fffbe0;' : ''}
        }
        ::slotted(*) {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        slot[name="child1"], slot[name="child2"] {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          ${debug ? 'background: #e0f7ff;' : ''}
        }
        .child-placeholder {
          width: var(--fixture-row-child-width, ${ROW_WIDTHS.child}px);
          height: 1.5em;
          display: block;
          background: transparent;
          margin-left: auto;
          margin-right: auto;
        }
        .winner {
          font-weight: bold;
        }
      </style>
      <div class="row">
        <div class="team1${team1Winner ? ' winner' : ''}">
          <slot name="team1-logo"></slot>
          <team-name name="${team1}" direction="r2l"></team-name>
        </div>
        <div class="score">
          <gaelic-score goals="${team1Goals}" points="${team1Points}" played="${outcome === 'played'}" layout="over"${team1Winner ? ' bold' : ''}></gaelic-score>
        </div>
        <slot name="child1"><div class="child-placeholder"></div></slot>
        <div class="center">
          <knockout-level
            match-id="${matchId}"
            stage="${stage}"
            stage-level="${stageLevel}"
            category="${category}">
          </knockout-level>
        </div>
        <slot name="child2"><div class="child-placeholder"></div></slot>
        <div class="score">
          <gaelic-score goals="${team2Goals}" points="${team2Points}" played="${outcome === 'played'}" layout="over"${team2Winner ? ' bold' : ''}></gaelic-score>
        </div>
        <div class="team2${team2Winner ? ' winner' : ''}">
          <slot name="team2-logo"></slot>
          <team-name name="${team2}"></team-name>
        </div>
      </div>
    `;
  }
}

customElements.define('fixture-row', FixtureRow);