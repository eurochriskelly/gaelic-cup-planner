class KnockoutLevel extends HTMLElement {
  static get observedAttributes() {
    return ['match-id', 'stage', 'stage-level', 'category', 'group', 'no-id']; // added no-id
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const matchId = this.getAttribute('match-id') || '';
    const showId = !this.hasAttribute('no-id'); // if no-id is present, hide fixture id
    const matchNum = showId ? matchId.slice(-3) : '';
    const stage = this.getAttribute('stage') || '';
    const stageLevel = this.getAttribute('stage-level') || '';
    const group = this.getAttribute('group') || '';
    let tint = this.getAttribute('tint') || '#98bdc5;'; // Default tint color

    // Extract last 3 digits of match ID (handled above if showId)

    let abbrev = '';
    let isPlacementGame = false;
    if (stage === 'group') {
      // Handle group stage
      tint = '#c3c598;'; 
      abbrev = `GP${group || '?'}`;
    } else {
      const [round, level] = stage.split('_');
      const [, levelNum] = stageLevel.split('.');
      // Determine display abbreviation for knockout stages
      if (['plt', 'plate'].includes(round)) tint = '#c598a1;';
      if (['shd', 'sld', 'shield', 'sheild'].includes(round)) tint = '#aaddbd;';

      if (level === 'final' || level === 'finals') {
        abbrev = 'FIN';
        isPlacementGame = true;
      } else if (level === 'semis' || level === 'semi') {
        abbrev = `SF${levelNum || ''}`;
      } else if ((level === 'quarters') || (level === 'quarter')) {
        abbrev = `QF${levelNum || ''}`;
      } else {
        // Handle positional matches (e.g., 3/4, 4/5, etc.)
        const mappings = {
          '3rd4th': '3/4',
          '4th5th': '4/5',
          '5th6th': '5/6',
          '6th7th': '6/7',
          '7th8th': '7/8',
          '8th9th': '8/9',
          '9th10th': '9/10',
          '10th11th': '10/11',
          '11th12th': '11/12',
          '12th13th': '12/13',
          '13th14th': '13/14',
          '14th15th': '14/15',
          '15th16th': '15/16',
          '16th17th': '16/17',
          '17th18th': '17/18',
          '18th19th': '18/19',
          '19th20th': '19/20'
        };

        const positionMatch = mappings[level];
        if (positionMatch) {
          // Split positions to apply different sizes for double-digit numbers
          const [pos1, pos2] = positionMatch.split('/');
          // Create HTML with appropriate sizing
          abbrev = `<div class="position-wrapper">
            <span class="${pos1.length > 1 ? 'small-pos' : 'big-pos'}">${pos1}</span><span class="separator">/</span><span class="${pos2.length > 1 ? 'small-pos' : 'big-pos'}">${pos2}</span>
          </div>`;
          isPlacementGame = true;
        } else {
          abbrev = level.toUpperCase();
        }
      }
    }

    // Determine content for the stage display area
    let stageContent = abbrev; // Default to text abbreviation
    /*
    if (abbrev === 'FIN') {
      stageContent = `<cup-icon icon="${abbrev}"></cup-icon>`;
    }*/

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: sans-serif;
          text-align: center;
          max-width: 4.1rem;
          min-width: 4.1rem;
          background: ${tint};
          border-radius: 100rem;
          ${isPlacementGame ? 'border: 0.33rem solid #e81350 !important;' : ''}
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 3em;
        }
        .match-num {
          font-size: 0.75em;
          color: white;
          line-height: 1;
        }
        .stage-abbrev {
          font-size: 1.1em;
          font-weight: bold;
          line-height: 1;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 20px;
          color: black;
        }
        .stage-abbrev svg {
          display: block;
          fill: currentColor;
        }
        .position-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        .big-pos {
          font-size: 1em;
        }
        .small-pos {
          font-size: 0.75em;
        }
        .separator {
          font-size: 0.9em;
        }
      </style>
      <div class="container">
        ${showId ? `<div class="match-num">#${matchNum}</div>` : ''}
        <div class="stage-abbrev">${stageContent}</div>
      </div>
    `;
  }
}

customElements.define('knockout-level', KnockoutLevel);
