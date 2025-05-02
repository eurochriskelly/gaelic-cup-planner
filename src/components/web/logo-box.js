
class LogoBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static md5(string) {
      function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }
      function AddUnsigned(lX, lY) {
        var lX4 = lX & 0x40000000;
        var lY4 = lY & 0x40000000;
        var lX8 = lX & 0x80000000;
        var lY8 = lY & 0x80000000;
        var lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
          return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
          }
        }
        return lResult ^ lX8 ^ lY8;
      }
      function F(x, y, z) { return (x & y) | ((~x) & z); }
      function G(x, y, z) { return (x & z) | (y & (~z)); }
      function H(x, y, z) { return x ^ y ^ z; }
      function I(x, y, z) { return y ^ (x | (~z)); }
      function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }
      function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue += WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      }
      var x = ConvertToWordArray(string);
      var a = 0x67452301;
      var b = 0xEFCDAB89;
      var c = 0x98BADCFE;
      var d = 0x10325476;
      var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
      var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
      var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
      var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
      for (var k = 0; k < x.length; k += 16) {
        var AA = a, BB = b, CC = c, DD = d;
        a = FF(a, b, c, d, x[k+0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k+1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k+2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k+3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k+4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k+5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k+6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k+7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k+8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k+9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k+1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k+6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k+0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k+5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k+4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k+9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k+3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k+8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k+2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k+7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k+5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k+8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k+1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k+4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k+7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k+0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k+3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k+6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k+9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k+2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k+0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k+7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k+5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k+3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k+1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k+8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k+6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
      }
      return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
    }
    static get observedAttributes() {
        return ['title', 'size', 'image', 'border-color'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    // Hash function to generate a consistent number from a string
    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Calculate relative luminance from RGB
    static getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }

    // Convert HSL to RGB for luminance calculation
    static hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [
            Math.round(f(0) * 255),
            Math.round(f(8) * 255),
            Math.round(f(4) * 255)
        ];
    }

    getColors() {
      const title = this.getAttribute('title') || '';
      const normalized = title.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const hash = LogoBox.md5(normalized);
      const firstColor = '#' + hash.substr(0, 6);
      const secondColor = '#' + hash.substr(1, 6);
      const patternIndex = parseInt(hash.substr(2, 2), 16) % 5;
      let bg, bgSize;
      switch (patternIndex) {
        case 0: // Diagonal stripes
          bg = `repeating-linear-gradient(45deg, ${firstColor}, ${firstColor} 5px, ${secondColor} 5px, ${secondColor} 10px)`;
          break;
        case 1: // Checkerboard
          bg = `linear-gradient(45deg, ${firstColor} 25%, ${secondColor} 25%, ${secondColor} 50%, ${firstColor} 50%, ${firstColor} 75%, ${secondColor} 75%, ${secondColor})`;
          bgSize = '20px 20px';
          break;
        case 2: // Grid
          bg = `repeating-linear-gradient(0deg, ${firstColor}, ${firstColor} 1px, ${secondColor} 1px, ${secondColor} 20px),
                repeating-linear-gradient(90deg, ${firstColor}, ${firstColor} 1px, ${secondColor} 1px, ${secondColor} 20px)`;
          break;
        case 3: // Vertical bars
          bg = `repeating-linear-gradient(90deg, ${firstColor}, ${firstColor} 10px, ${secondColor} 10px, ${secondColor} 20px)`;
          break;
        case 4: // Horizontal bars
          bg = `repeating-linear-gradient(0deg, ${firstColor}, ${firstColor} 10px, ${secondColor} 10px, ${secondColor} 20px)`;
          break;
        default:
          bg = `linear-gradient(45deg, ${firstColor}, ${secondColor})`;
      }
      const rgb = parseInt(firstColor.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const luminance = LogoBox.getLuminance(r, g, b);
      const color = luminance > 0.5 ? '#000000' : '#FFFFFF';
      return { bg, bgSize, color };
    }

    getInitials(title) {
        if (!title) return '?';
        
        // Handle special case for names starting with ~
        if (title.startsWith('~')) {
            return '?';
        }
        
        // Handle names with slashes differently
        if (title.includes('/')) {
            const parts = title.split('/');
            let initials = '';
            for (const part of parts) {
                const trimmed = part.trim();
                if (trimmed.length > 0) {
                    initials += trimmed[0].toUpperCase();
                    if (initials.length >= 3) break;
                }
            }
            return initials || '?';
        }
        
        // Original behavior for non-slash names
        const validChars = title.match(/[A-Z0-9]/g);
        return validChars ? validChars.join('').slice(0, 3) : '?';
    }

    render() {
        const title = this.getAttribute('title') || '';
        const size = this.getAttribute('size') || '30px';
        const image = this.getAttribute('image');
        
        let style, overlayColor, initials;
        if (title.startsWith('~')) {
            style = {
                bg: '#ccc',  // Changed from #999 to #ccc (50% lighter)
                color: '#000'
            };
            overlayColor = 'rgba(0,0,0,0.1)';  // Made overlay more transparent too
            initials = '?';
        } else {
            style = this.getColors();
            overlayColor = style.color === '#000000' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
            initials = this.getInitials(title);
        }

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .logo-box {
                    position: relative;
                    width: ${size};
                    height: ${size};
                    background: ${image ? 'transparent' : style.bg};
                    color: ${style.color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    border: 3px solid ${this.getAttribute('border-color') || '#333'};
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${overlayColor};
                    z-index: 1;
                }
                .text {
                    position: relative;
                    z-index: 2;
                    font-size: calc(${size} * 0.5);
                    font-weight: bold;
                    text-transform: uppercase;
                    line-height: 1;
                    font-family: 'Arial Narrow', 'Arial', sans-serif;
                    letter-spacing: -0.05em;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            </style>
            <div class="logo-box">
                ${image 
                    ? `<img src="${image}" alt="${initials}">`
                    : `<div class="overlay"></div>
                       ${this.hasAttribute('icon-only') ? '' : `<span class="text">${initials}</span>`}`
                }
            </div>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('logo-box', LogoBox);
