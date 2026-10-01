# Rektifikations·Monitor

Interaktive Live-Simulation einer Rektifikationskolonne (nur Verstärkungsteil) für ein binäres Gemisch. Entwickelt für die Lehre an der Fakultät Angewandte Chemie der TH Nürnberg, im Ohm-Corporate-Design.

**Live-Version:** https://corinnabusse.github.io/rektifikation-app/

## Funktionen

- **Dynamische Simulation** einer Bodenkolonne mit Rücklauf: Die Stoffbilanzen aller Böden werden live per expliziter Euler-Integration gelöst. Der Zulauf erfolgt direkt in den Sumpf (kein separater Abtriebsteil).
- **Systemträgheit:** Ein fester Flüssigkeits-Holdup je Boden, Sumpf und Kopf sorgt für realistische An- und Übergangsphasen.
- **Einstellbare Parameter**
  - Kolonne: Anzahl der Böden *N* (vor dem Start)
  - Feed: Feed-Strom *F* und Zusammensetzung *x_F* (live änderbar)
  - Betrieb: Rücklaufverhältnis *R = L/D* und Destillatstrom *D* (live änderbar)
  - Stoffsystem: relative Flüchtigkeit *α* (vor dem Start)
  - Zeitraffer (Simulationsgeschwindigkeit)
- **Visualisierung**
  - Zeitverlauf der Destillat- und Sumpfzusammensetzung *x_D* / *x_B*
  - Aktuelles Bodenprofil als Kolonnenschema
  - McCabe-Thiele-Diagramm mit Gleichgewichtskurve, Verstärkungsgerade, Stufenkonstruktion und den live simulierten Bodenpunkten
  - Vergleich theoretische vs. vorhandene Böden
- **CSV-Export** der Parameter, des Zeitverlaufs und des aktuellen Bodenprofils (deutsches Zahlenformat, Excel-kompatibel)

Während der Übergangsphase liegen die simulierten Punkte noch nicht auf der McCabe-Thiele-Treppe und wandern erst mit Erreichen des stationären Zustands dorthin. So wird der Unterschied zwischen stationärer Auslegung und dynamischem Verhalten sichtbar.

## Technik

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) für die Diagramme

## Schnellstart

Voraussetzung: [Node.js](https://nodejs.org/) ab Version 20.

```bash
npm install
npm run dev
```

Die App ist anschließend unter der von Vite angezeigten Adresse erreichbar (standardmäßig http://localhost:5173/rektifikation-app/).

## Produktions-Build

```bash
npm run build     # erzeugt den Build in ./dist
npm run preview   # Build lokal testen
```

## Deployment

Bei jedem Push auf `main` baut ein GitHub-Actions-Workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) die App und veröffentlicht sie auf GitHub Pages. Der Basis-Pfad `/rektifikation-app/` ist in [vite.config.js](vite.config.js) festgelegt.

## Projektstruktur

```
├── index.html          # HTML-Einstiegspunkt
├── src/
│   ├── main.jsx        # React-Einstieg
│   ├── App.jsx         # Simulation, Bedienfeld und Diagramme
│   └── index.css       # Tailwind-Import und globale Styles
├── vite.config.js
└── .github/workflows/deploy.yml
```
