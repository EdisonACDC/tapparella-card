# 🪟 Tapparella Card

  Card personalizzata Lovelace per Home Assistant per la gestione delle tapparelle domotiche.

  [![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

  ## Funzionalità

  - Illustrazione SVG della finestra che si **oscura progressivamente** con la chiusura
  - **Percentuale di apertura** con barra colorata dinamica
  - Pulsanti **Chiudi / Stop / Apri**
  - Stato della **finestra aperta o chiusa** (sensore opzionale)
  - Avviso se finestra aperta con tapparella quasi chiusa

  ## Installazione via HACS

  1. In HACS → **Frontend** → clicca **+**
  2. Aggiungi repository custom: `https://github.com/EdisonACDC/tapparella-card`
  3. Seleziona **Tapparella Card** e installa
  4. Riavvia Home Assistant

  ## Configurazione

  ```yaml
  type: custom:tapparella-card
  entity: cover.tapparella_soggiorno
  name: Soggiorno
  window_entity: binary_sensor.finestra_soggiorno  # opzionale
  ```

  | Opzione | Tipo | Richiesto | Descrizione |
  |--------|------|-----------|-------------|
  | `entity` | string | ✅ | Entità cover della tapparella |
  | `name` | string | ❌ | Nome visualizzato nella card |
  | `window_entity` | string | ❌ | Sensore binario stato finestra |
  