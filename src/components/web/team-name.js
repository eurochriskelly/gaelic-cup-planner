class TeamName extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name', 'showLogo', 'height', 'direction', 'maxchars', 'completion', 'width'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    getOrdinalSuffix(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    }

    renderNameParts(name) {
        if (!name) return '<span>?</span>';

        // Handle special ~ names
        if (name.startsWith('~')) {
            const groupMatch = name.match(/^~group:(\d+)\/p:(\d+)$/);
            if (groupMatch) {
                const N = groupMatch[1];
                const M = parseInt(groupMatch[2], 10);
                if (M >= 1 && M <= 9) {
                    return `<span>${M}${this.getOrdinalSuffix(M)} Gp.${N}</span>`;
                }
            }

            const matchMatch = name.match(/^~match:(\d+)\/p:([12])$/);
            if (matchMatch) {
                const N = matchMatch[1];
                const M = parseInt(matchMatch[2], 10);
                const type = M === 1 ? 'Winner' : 'Loser';
                // Take last 3 digits and pad with leading zeros if necessary
                const lastThreeDigits = N.slice(-3);
                const paddedN = lastThreeDigits.padStart(3, '0');
                return `<span>${type} #${paddedN}</span>`;
            }

            // Fallback for unrecognised ~ format
            return `<span>${name}</span>`;
        }

        // Original logic for regular names
        const maxChars = parseInt(this.getAttribute('maxchars')) || 0;
        let displayName = name;
        let isTruncated = false;
        
        if (maxChars > 0 && name.length > maxChars) {
            displayName = name.substring(0, maxChars);
            isTruncated = true;
        }

        const parts = displayName.split('/');

        // Apply character limits per part based on number of parts
        let partMaxLength = 0;
        if (parts.length === 2) {
            partMaxLength = 12;
        } else if (parts.length >= 3) {
            partMaxLength = 10;
        }

        // Truncate each part if necessary
        const truncatedParts = parts.map(part => {
            if (partMaxLength > 0 && part.trim().length > partMaxLength) {
                return part.trim().substring(0, partMaxLength);
            }
            return part.trim();
        });

        // Check if any part was truncated
        const anyPartTruncated = partMaxLength > 0 && parts.some((part, i) => part.trim().length > partMaxLength);

        if (truncatedParts.length === 1) {
            return `<span title="${isTruncated || anyPartTruncated ? name : ''}">${truncatedParts[0]}${isTruncated ? '<span style="color:pink">→</span>' : ''}</span>`;
        }

        return truncatedParts.map((part, index) =>
            index === 0
                ? `<span title="${isTruncated || anyPartTruncated ? name : ''}">${part}</span>`
                : `<span style="color:pink;margin:0.3rem">/</span><span title="${isTruncated || anyPartTruncated ? name : ''}">${part}${isTruncated && index === truncatedParts.length - 1 ? '<span style="color:pink">→</span>' : ''}</span>`
        ).join('');
    }

    render() {
        const name = this.getAttribute('name').toUpperCase() || '';
        const showLogo = this.getAttribute('showLogo') !== 'false';
        const height = this.getAttribute('height') || '30px';
        const direction = this.getAttribute('direction') || 'l2r';
        const completion = parseInt(this.getAttribute('completion') || '1');
        const isR2L = direction === 'r2l';

        // Calculate the max-width based on completion level
        let nameMaxWidth = '530px'; // Default for completion 1
        if (completion === 2) {
            nameMaxWidth = '300px';
        } else if (completion === 3) {
            nameMaxWidth = '270px';
        }

        const marginSide = `calc(${height} / 2)`;
        const logoSize = `calc(${height} * 1.4)`;
        const spacerWidth = `calc(${logoSize} * ${completion - 1} * 1.3)`;

        const widthAttr = this.getAttribute('width');
        const containerStyle = `
            display: flex;
            flex-direction: ${isR2L ? 'row-reverse' : 'row'};
            align-items: center;
            width: 100%; /* Default to 100% */
            white-space: nowrap;
            ${widthAttr ? `width: ${widthAttr}; min-width: ${widthAttr}; max-width: ${widthAttr};` : ''} /* Apply width attribute if present */
            box-sizing: border-box;
        `;

        const logoMarginStyle = `margin-${isR2L ? 'left' : 'right'}: ${marginSide}; flex-shrink: 0;`;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .name-container {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                    align-items: center;
                }
            </style>
            <span class="container" style="${containerStyle}">
                ${isR2L && completion > 1 ? `
                    <span class="spacer" style="width: ${spacerWidth}; flex-shrink: 0;"></span>
                ` : ''}
                ${!isR2L && completion > 1 ? `
                    <span class="spacer" style="width: ${spacerWidth}; flex-shrink: 0;"></span>
                ` : ''}
                ${showLogo ? `
                    <span class="logo-container" style="${logoMarginStyle}; flex-shrink: 0;">
                        <logo-box size="${logoSize}" title="${name}" ${name.startsWith('~') ? 'border-color="red"' : ''}></logo-box>
                    </span>
                ` : ''}
                ${this.hasAttribute('icon-only') ? '' : `<span class="name-container" style="flex: 1; min-width: 0; max-width: ${nameMaxWidth}; overflow: hidden; text-overflow: ellipsis; ${isR2L ? 'justify-content: flex-end;' : ''}">
                    ${this.renderNameParts(name)}
                </span>`}
            </span>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('team-name', TeamName);
