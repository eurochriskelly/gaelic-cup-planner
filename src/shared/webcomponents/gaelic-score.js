class GaelicScore extends HTMLElement {
  static get observedAttributes() {
    return ['goals', 'points', 'layout', 'scale', 'goalsagainst', 'pointsagainst', 'played', 'bold'];
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
    const rawGoals = this.getAttribute('goals');
    const rawPoints = this.getAttribute('points');
    const layout = this.getAttribute('layout') || 'default';
    const scale = parseFloat(this.getAttribute('scale') || '1');
    const isBold = this.hasAttribute('bold');

    // If goals or points is empty, missing, or "null", display a single N/A
    if (
      !rawGoals || rawGoals.trim() === "" || (rawGoals === "null" || rawGoals === "NaN") ||
      !rawPoints || rawPoints.trim() === "" || (rawPoints === "null" || rawPoints === "NaN")
    ) {
      this.shadowRoot.innerHTML = '<div class="unplayed" style="font-size:80%;color:#aaa">#&nbsp;##</div>';
      return;
    }

    const goals = parseInt(rawGoals, 10);
    const points = parseInt(rawPoints, 10);

    const goalsAgainst = parseInt(this.getAttribute('goalsagainst') || '0', 10);
    const pointsAgainst = parseInt(this.getAttribute('pointsagainst') || '0', 10);
    const played = this.getAttribute('played') !== 'false';

    // Handle unplayed matches
    if (!played) {
      // Check for walkover scenario (1-1 vs 0-0)
      if (goals === 0 && points === 1 && goalsAgainst === 0 && pointsAgainst === 0) {
        this.shadowRoot.innerHTML = '<div class="unplayed"><span style="font-size:70%;">WALK OVER</span></div>';
        return;
      }
      if (goals === 0 && points === 0 && goalsAgainst === 0 && pointsAgainst === 1) {
        this.shadowRoot.innerHTML = '<div class="unplayed"><span style="font-size:70%;">SCR</span></div>';
        return;
      }
      // Check for shared points scenario (0-0 vs 0-0)
      if (goals === 0 && points === 0 && goalsAgainst === 0 && pointsAgainst === 0) {
        this.shadowRoot.innerHTML = '<div class="unplayed"><span style="font-size:70%;">SHARE</span></div>';
        return;
      }
    }

    const total = goals * 3 + points;
    const totalAgainst = goalsAgainst * 3 + pointsAgainst;
    const diff = total - totalAgainst;

    const goalStr = goals.toString();
    const pointStr = points.toString().padStart(2, '0');
    const totalStr = total.toString().padStart(2, '0');
    // Formatted score parts
    const scorePart = `<span class="score-value">${goalStr}-${pointStr}</span>`;
    let totalPart = `<span>(${totalStr})</span>`; // Total points in separate span
    if (layout === 'over') {
      totalPart = `<span>${totalStr}</span>`;
    }

    let content = '';

    if (layout === 'r2l') {
      content = `
        <span class="score-group">
          ${totalPart} ${scorePart} 
        </span>
      `; // Added space after scorePart for consistency, though layout might override
    } else if (layout === 'over') {
      content = `
        <div class="over-container">
          <div class="top">${scorePart}</div>
          <div class="bottom">${totalPart}</div>
        </div>
      `;
    } else if (layout === 'compare' || layout === 'compare-rtl') {
        const scoreFor = goals * 3 + points;
        const scoreAgainst = goalsAgainst * 3 + pointsAgainst;
        const diff = scoreFor - scoreAgainst;

        let diffText = '';
        let diffClass = '';
        const absDiff = Math.abs(diff);
        let opacity = Math.min(75, Math.max(25, Math.floor(absDiff) * 5));
        
        if (diff > 0) {
          diffText = `+${diff}`;
          diffClass = 'green';
        } else if (diff < 0) {
          diffText = `${diff}`;
          diffClass = 'red';
        } else {
          diffText = `=`;
          diffClass = 'blue';
          opacity = 50; // Force 50% opacity for draws
        }

        this.classList.add(diffClass);
        this.style.setProperty('--opacity', opacity);
        
        // Use the scorePart span here
        const topRow = `<div class="compare-top">${scorePart}</div>`;
        const bottomRow = `<div class="compare-bottom"><span class="difference">${diffText}</span></div>`;

        content = topRow + bottomRow;
    } else { // Default layout
      // Combine the two separate spans with a space
      content = `<span class="gaelic-score">${scorePart} ${totalPart}</span>`; // Space already exists here from previous change
    }

    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            font-family: sans-serif;
            transform: scale(${scale});
            transform-origin: top left;
            display: block;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }
          .score-value {
            font-weight: ${isBold ? 'bold' : 'normal'};
          }
          /* Removed .bracket style as it's now part of the span */

          .over-container {
            text-align: center;
          }
          .top { 
            text-align: center;
            font-size: 1rem;
          }
          
          .bottom {
            text-align: center;
            font-size: 2rem;
            line-height: 1;
          }

          .compare-top {
            text-align: center;
            font-size: 1.32rem; /* Increased by 20% */
            letter-spacing: 0em;
            margin-bottom: 0.1em;
          }

          .compare-bottom {
            text-align: center;
            font-size: 1.44rem; /* Decreased by 20% */
            line-height: 1;
          }

          :host(.green) {
            background: rgba(76, 175, 80, calc(var(--opacity) / 100));
          }

          :host(.red) {
            background: rgba(244, 67, 54, calc(var(--opacity) / 100));
          }

          :host(.blue) {
            background: rgba(33, 150, 243, calc(var(--opacity) / 100));
          }

          .compare-top {
            color: white;
          }
          
          .difference {
            display: inline-block;
            color: black;
            font-weight: normal;
            font-size: 1em;
            min-width: 2em;
            text-align: center;
            padding: 0.7rem;
            padding-left: 0;
            padding-right: 0;
          }

          .slash {
            color: hotpink;
            padding: 0 0.2em;
            font-weight: bold;
          }

          .unplayed {
            text-align: center;
            font-size: 0.9rem;
            font-weight: bold;
            white-space: nowrap;
            color: #AAA;
            font-weight: bold;
            padding: 0.5em;
          }
        </style>
      ${content}
    `;
  }
}

customElements.define('gaelic-score', GaelicScore);
