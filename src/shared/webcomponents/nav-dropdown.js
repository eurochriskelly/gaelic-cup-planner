// src/ui/public/scripts/webcomponents/nav-dropdown.js
class NavDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  static get observedAttributes() {
    return ['title', 'items'];
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('.dropdown-toggle').addEventListener('click', this.toggle.bind(this));
    document.addEventListener('click', this.closeIfOutside.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.closeIfOutside.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  toggle(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.render();
  }

  closeIfOutside(event) {
    if (!this.contains(event.target)) {
      this.isOpen = false;
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Dropdown';
    const items = JSON.parse(this.getAttribute('items') || '[]');
    this.shadowRoot.innerHTML = `
      <style>
        .dropdown { position: relative; display: inline-block; }
        /* Make the dropdown title link white */
        .dropdown-toggle { 
          cursor: pointer; 
          color: white !important; /* Added !important */
          text-decoration: none; /* Added for consistency */
        }
        .dropdown-toggle:hover {
          color: lightgray; /* Added hover effect */
        }
        .dropdown-content {
          display: ${this.isOpen ? 'block' : 'none'};
          position: absolute;
          background-color: #f9f9f9;
          min-width: 160px;
          box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
          z-index: 1;
        }
        .dropdown-content a {
          color: black;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
        }
        .dropdown-content a:hover { background-color: #f1f1f1; }
      </style>
      <div class="dropdown">
        <a class="dropdown-toggle" href="#">${title}</a>
        <div class="dropdown-content">
          ${items.map(item => `<a href="${item.href}" ${item.hxAttrs || ''}>${item.label}</a>`).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('nav-dropdown', NavDropdown);
