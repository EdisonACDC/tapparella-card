# Tapparella Card

  Card domotica per la gestione delle tapparelle, costruita con React e TypeScript.

  ## Funzionalità

  - **Percentuale di apertura** con barra colorata dinamica
  - **Illustrazione SVG** della finestra che si oscura in base alla chiusura della tapparella
  - **Toggle finestra** aperta/chiusa con visualizzazione nel disegno
  - **Pulsanti rapidi**: Chiudi / 50% / Apri
  - **Avviso automatico** se la finestra è aperta con tapparella quasi chiusa

  ## Stack

  - React + TypeScript
  - Tailwind CSS
  - SVG animato inline

  ## Utilizzo

  ```tsx
  import TapparellaCard from "./TapparellaCard";

  function App() {
    return <TapparellaCard />;
  }
  ```
  