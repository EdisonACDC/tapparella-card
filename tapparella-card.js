/**
   * Tapparella Card per Home Assistant
   * Custom Lovelace card per tapparelle domotiche
   * Autore: EdisonACDC
   */

  // ── EDITOR VISUALE ─────────────────────────────────────────────────────────────
  class TapparellaCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
      this._hass = null;
      this._form = null;
    }

    static get SCHEMA() {
      return [
        { name: 'name', label: 'Nome visualizzato', selector: { text: {} } },
        {
          name: 'entity',
          label: 'Entità tapparella (cover) *',
          required: true,
          selector: { entity: { domain: 'cover' } }
        },
        {
          name: 'window_entity',
          label: 'Sensore finestra (binary_sensor) – opzionale',
          selector: { entity: { domain: 'binary_sensor' } }
        },
      ];
    }

    setConfig(config) {
      this._config = { ...config };
      this._syncForm();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._form) this._form.hass = hass;
    }

    connectedCallback() {
      if (!this._form) this._buildForm();
    }

    _buildForm() {
      this.shadowRoot.innerHTML = '';

      const form = document.createElement('ha-form');
      form.hass = this._hass;
      form.data = this._config;
      form.schema = TapparellaCardEditor.SCHEMA;
      form.computeLabel = (s) => s.label;
      form.addEventListener('value-changed', (e) => {
        this._config = e.detail.value;
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config: this._config },
          bubbles: true,
          composed: true,
        }));
      });

      this._form = form;
      this.shadowRoot.appendChild(form);
    }

    _syncForm() {
      if (this._form) {
        this._form.data = this._config;
      } else if (this.isConnected) {
        this._buildForm();
      }
    }
  }
  customElements.define('tapparella-card-editor', TapparellaCardEditor);


  // ── CARD PRINCIPALE ─────────────────────────────────────────────────────────────
  class TapparellaCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._hass = null;
      this._config = null;
    }

    static getConfigElement() {
      return document.createElement('tapparella-card-editor');
    }

    static getStubConfig() {
      return { entity: 'cover.tapparella_soggiorno', name: 'Soggiorno' };
    }

    setConfig(config) {
      if (!config.entity) throw new Error('Devi specificare entity (es: cover.tapparella_soggiorno)');
      this._config = config;
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._render();
    }

    getCardSize() { return 4; }

    _getPosition() {
      if (!this._hass || !this._config) return 0;
      const e = this._hass.states[this._config.entity];
      if (!e) return 0;
      return e.attributes.current_position ?? (e.state === 'open' ? 100 : 0);
    }

    _isWindowOpen() {
      if (!this._hass || !this._config.window_entity) return false;
      const e = this._hass.states[this._config.window_entity];
      return e?.state === 'on';
    }

    _callService(service) {
      if (!this._hass) return;
      this._hass.callService('cover', service, { entity_id: this._config.entity });
    }

    _getWindowSvg(position, windowOpen) {
      const darkness = (1 - position / 100) * 0.82;
      const slatCount = 9;
      const slats = [];
      for (let i = 0; i < slatCount; i++) {
        const sH = 152 / slatCount;
        const y = 16 + i * sH;
        const t = Math.max(1, sH * (1 - (position / 100) * 0.82));
        const op = 0.55 + (1 - position / 100) * 0.35;
        slats.push('<rect x="8" y="' + y.toFixed(1) + '" width="284" height="' + t.toFixed(1) + '" fill="#94a3b8" opacity="' + op.toFixed(2) + '"/>');
      }
      const openPanel = windowOpen
        ? '<g clip-path="url(#wc)"><g transform="translate(150,16) rotate(-35,0,0)"><rect x="0" y="0" width="114" height="152" fill="#bfdbfe" opacity="0.25" rx="2"/><rect x="0" y="0" width="4" height="152" fill="#94a3b8" opacity="0.6"/><rect x="110" y="0" width="4" height="152" fill="#94a3b8" opacity="0.6"/><rect x="0" y="0" width="114" height="4" fill="#94a3b8" opacity="0.6"/><rect x="0" y="74" width="114" height="4" fill="#94a3b8" opacity="0.6"/><rect x="55" y="0" width="4" height="152" fill="#94a3b8" opacity="0.4"/></g><rect x="150" y="16" width="4" height="152" fill="#64748b" opacity="0.4"/></g>'
        : '<rect x="16" y="16" width="132" height="152" fill="none" stroke="#64748b" stroke-width="3"/><rect x="148" y="16" width="136" height="152" fill="none" stroke="#64748b" stroke-width="3"/><rect x="16" y="88" width="132" height="3" fill="#64748b" opacity="0.5"/><rect x="148" y="88" width="136" height="3" fill="#64748b" opacity="0.5"/><rect x="79" y="16" width="3" height="152" fill="#64748b" opacity="0.5"/><rect x="214" y="16" width="3" height="152" fill="#64748b" opacity="0.5"/><rect x="68" y="85" width="26" height="12" rx="3" fill="#94a3b8"/><rect x="206" y="85" width="26" height="12" rx="3" fill="#94a3b8"/>';

      return '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;border-radius:10px;">'
        + '<defs>'
        + '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="60%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#bfdbfe"/></linearGradient>'
        + '<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#16a34a"/></linearGradient>'
        + '<clipPath id="wc"><rect x="16" y="16" width="268" height="152" rx="4"/></clipPath>'
        + '</defs>'
        + '<rect x="0" y="0" width="300" height="180" fill="#e2e8f0"/>'
        + '<g clip-path="url(#wc)"><rect x="16" y="16" width="268" height="152" fill="url(#sky)"/>'
        + '<ellipse cx="220" cy="38" rx="28" ry="28" fill="white" opacity="0.85"/><ellipse cx="245" cy="32" rx="20" ry="20" fill="white" opacity="0.85"/><ellipse cx="195" cy="40" rx="16" ry="16" fill="white" opacity="0.7"/>'
        + '<ellipse cx="80" cy="50" rx="18" ry="18" fill="white" opacity="0.6"/><ellipse cx="98" cy="44" rx="14" ry="14" fill="white" opacity="0.6"/>'
        + '<rect x="16" y="130" width="268" height="38" fill="url(#gnd)"/><rect x="16" y="118" width="268" height="16" fill="#86efac" opacity="0.5"/></g>'
        + openPanel
        + '<rect x="8" y="8" width="4" height="164" rx="2" fill="#64748b"/><rect x="288" y="8" width="4" height="164" rx="2" fill="#64748b"/>'
        + '<rect x="8" y="8" width="284" height="4" rx="2" fill="#64748b"/><rect x="8" y="168" width="284" height="4" rx="2" fill="#64748b"/>'
        + slats.join('')
        + '<rect x="16" y="16" width="268" height="152" fill="rgba(15,23,42,' + darkness.toFixed(3) + ')"/>'
        + '<rect x="8" y="8" width="284" height="8" rx="3" fill="#475569"/><rect x="140" y="2" width="20" height="12" rx="2" fill="#334155"/>'
        + '</svg>';
    }

    _render() {
      if (!this._config) return;
      const position = this._getPosition();
      const windowOpen = this._isWindowOpen();
      const name = this._config.name || this._config.entity;
      const hasWindow = !!this._config.window_entity;
      const barColor = position === 0 ? '#94a3b8' : position < 50 ? '#34d399' : position < 100 ? '#fbbf24' : '#fb923c';
      const dotColor = position === 0 ? '#94a3b8' : position === 100 ? '#fb923c' : '#34d399';
      const statusText = position === 0 ? 'Chiusa' : position === 100 ? 'Aperta' : 'Parziale';
      const winIcon = windowOpen
        ? '<rect x="1" y="1" width="20" height="20" rx="2" stroke="#3b82f6" stroke-width="1.5" fill="#dbeafe"/><line x1="11" y1="1" x2="11" y2="21" stroke="#3b82f6" stroke-width="1.2"/><line x1="1" y1="11" x2="21" y2="11" stroke="#3b82f6" stroke-width="1.2"/><path d="M2 2 L9 9" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>'
        : '<rect x="1" y="1" width="20" height="20" rx="2" stroke="#94a3b8" stroke-width="1.5" fill="#f1f5f9"/><line x1="11" y1="1" x2="11" y2="21" stroke="#94a3b8" stroke-width="1.2"/><line x1="1" y1="11" x2="21" y2="11" stroke="#94a3b8" stroke-width="1.2"/>';

      const windowSection = hasWindow ? `
        <div class="win-row">
          <div class="win-info">
            <div class="win-ic ${windowOpen ? 'open' : ''}">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">${winIcon}</svg>
            </div>
            <div>
              <div class="win-lbl">Finestra</div>
              <div class="win-st ${windowOpen ? 'open' : ''}">${windowOpen ? 'Aperta' : 'Chiusa'}</div>
            </div>
          </div>
        </div>
        ${windowOpen && position < 20 ? '<div class="warn">⚠️ Attenzione: finestra aperta con tapparella quasi chiusa!</div>' : ''}
      ` : '';

      this.shadowRoot.innerHTML = `
        <style>
          :host{display:block}
          .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.12);font-family:var(--primary-font-family,sans-serif)}
          .hdr{background:linear-gradient(135deg,#334155,#1e293b);padding:14px 18px;display:flex;align-items:center;justify-content:space-between}
          .lbl{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
          .nm{font-size:18px;font-weight:600;color:#fff}
          .bi{display:flex;flex-direction:column;gap:3px;padding:6px;background:rgba(255,255,255,.1);border-radius:10px}
          .sl{background:#cbd5e1;border-radius:2px;width:36px}
          .wa{padding:12px 14px 0}
          .body{padding:14px 18px;display:flex;flex-direction:column;gap:14px}
          .pr{display:flex;align-items:center;justify-content:space-between}
          .st{display:flex;align-items:center;gap:8px}
          .dot{width:10px;height:10px;border-radius:50%}
          .stxt{font-size:14px;font-weight:600}
          .pct{font-size:32px;font-weight:700;color:#1e293b}
          .pct span{font-size:18px;color:#94a3b8;font-weight:500}
          .bw{background:#f1f5f9;border-radius:6px;height:8px;overflow:hidden}
          .b{height:100%;border-radius:6px;transition:width .4s}
          .br{display:flex;gap:8px}
          .btn{flex:1;padding:8px 4px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s}
          .btn:hover{background:#f8fafc}
          .div{height:1px;background:#f1f5f9}
          .win-row{display:flex;align-items:center;justify-content:space-between}
          .win-info{display:flex;align-items:center;gap:10px}
          .win-ic{width:36px;height:36px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center}
          .win-ic.open{background:#dbeafe}
          .win-lbl{font-size:14px;font-weight:500;color:#334155}
          .win-st{font-size:12px;font-weight:600;color:#94a3b8}
          .win-st.open{color:#3b82f6}
          .warn{margin-top:10px;background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:8px 12px;font-size:12px;color:#92400e;font-weight:500}
          .ft{background:#f8fafc;padding:10px 18px;display:flex;justify-content:space-between;border-top:1px solid #f1f5f9}
          .ft span{font-size:12px;color:#94a3b8}
        </style>
        <ha-card>
          <div class="card">
            <div class="hdr">
              <div><div class="lbl">Tapparella</div><div class="nm">${name}</div></div>
              <div class="bi">${[0,1,2,3,4,5].map(() => '<div class="sl" style="height:' + Math.max(2,6-(position/100)*4) + 'px"></div>').join('')}</div>
            </div>
            <div class="wa">${this._getWindowSvg(position, windowOpen)}</div>
            <div class="body">
              <div class="pr">
                <div class="st"><div class="dot" style="background:${dotColor}"></div><span class="stxt" style="color:${dotColor}">${statusText}</span></div>
                <div class="pct">${position}<span>%</span></div>
              </div>
              <div class="bw"><div class="b" style="width:${position}%;background:${barColor}"></div></div>
              <div class="br">
                <button class="btn" id="bc">Chiudi</button>
                <button class="btn" id="bs">Stop</button>
                <button class="btn" id="bo">Apri</button>
              </div>
              <div class="div"></div>
              ${windowSection}
            </div>
            <div class="ft"><span>Ultima posizione</span><span>${position}%</span></div>
          </div>
        </ha-card>`;

      this.shadowRoot.getElementById('bc')?.addEventListener('click', () => this._callService('close_cover'));
      this.shadowRoot.getElementById('bs')?.addEventListener('click', () => this._callService('stop_cover'));
      this.shadowRoot.getElementById('bo')?.addEventListener('click', () => this._callService('open_cover'));
    }
  }

  customElements.define('tapparella-card', TapparellaCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'tapparella-card',
    name: 'Tapparella Card',
    description: 'Card per tapparelle domotiche con visualizzazione finestra',
    preview: true,
  });
  