import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceLine, Tooltip,
} from "recharts";

/* ---------------------------------------------------------------------
   TOKENS — "die Ohm" Corporate Design
--------------------------------------------------------------------- */
const OHM_RED = "#C72426";
const OHM_BLUE = "#16283D";
const INK = OHM_BLUE;
const BG = "#F4F4F3";
const PANEL = "#FFFFFF";
const PANEL_BORDER = "#E0DEDC";
const GRAY = "#6B6B6B";
const CHART_BG = "#FFFFFF";
const CHART_GRID = "#E5E3E1";
const PALE = "#EAF1F6";
const SANS = "'Inter', 'IBM Plex Sans', ui-sans-serif, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const H = 2300; // feste Trägheitskonstante (Flüssigkeits-Holdup je Boden/Sumpf/Kopf), nicht einstellbar
const EULER_RATIO = 0.1; // feste Euler-Schrittweite (Rate·Δt), nicht einstellbar
const OHM_LOGO = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJFYmVuZV8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjkuNDMgNDAuODQiPjxnIGlkPSJMb2dvIj48Zz48Zz48cGF0aCBkPSJtMTE2LjI2LDE4LjI4di02LjVoLTIuMzh2LS44N2g1LjU4di44N2gtMi4yNXY2LjVoLS45NVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTIyLDE4LjM5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjcuNjcsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMS4wMSwxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzNi44OSwxOC4yOHYtNS4yN2guOTJ2Ljc2Yy4wOC0uMTUuMi0uMjguMzUtLjQxLjE1LS4xMy4zMy0uMjMuNTUtLjMxcy40Ni0uMTIuNzUtLjEyYy4zMywwLC42NC4wNy45Mi4ycy41LjM0LjY3LjYyYy4xNy4yOC4yNS42NC4yNSwxLjA4djMuNDVoLS45NHYtMy4zNWMwLS40MS0uMTEtLjcyLS4zMi0uOTItLjIyLS4yLS41LS4zLS44NC0uMy0uMjQsMC0uNDYuMDQtLjY3LjEyLS4yMS4wOC0uMzguMTktLjUuMzUtLjEzLjE1LS4xOS4zNS0uMTkuNTh2My41MmgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNDIuNzcsMTEuOXYtLjk4aC45N3YuOThoLS45N1ptLjAzLDYuMzl2LTUuMjdoLjkxdjUuMjdoLS45MVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTQ3LjIsMTguMzljLS4zNywwLS43MS0uMDYtMS4wMi0uMTctLjMxLS4xMS0uNTgtLjI5LS43OC0uNTQtLjIxLS4yNC0uMzQtLjU1LS4zOS0uOTNoLjg2Yy4wNC4yMS4xMy4zOC4yNS41Mi4xMi4xNC4yOC4yNC40Ny4zMS4xOS4wNy4zOS4xLjYxLjEuMzYsMCwuNjQtLjA3Ljg2LS4yLjIyLS4xMy4zMy0uMzQuMzMtLjYxLDAtLjE5LS4wNi0uMzUtLjE3LS40Ny0uMTEtLjEyLS4yOS0uMi0uNTMtLjI2bC0xLjA5LS4yN2MtLjQyLS4xLS43Ni0uMjYtMS4wMi0uNDgtLjI1LS4yMi0uMzgtLjUyLS4zOC0uOTEsMC0uMzEuMDctLjU4LjIyLS44MnMuMzctLjQyLjY3LS41NmMuMy0uMTQuNjctLjIsMS4xMS0uMi41NywwLDEuMDQuMTMsMS4zOS4zOS4zNS4yNi41My42My41NSwxLjEzaC0uODRjLS4wMy0uMjUtLjE1LS40NS0uMzQtLjYtLjE5LS4xNS0uNDUtLjIyLS43Ny0uMjJzLS42MS4wNy0uODIuMmMtLjIxLjEzLS4zMi4zNC0uMzIuNjIsMCwuMTkuMDguMzMuMjMuNDQuMTUuMTEuMzcuMi42Ni4yN2wxLjA2LjI3Yy4yNC4wNi40NC4xNS42LjI1LjE2LjExLjI5LjIyLjM4LjM1cy4xNi4yNi4yLjQxLjA2LjI4LjA2LjQxYzAsLjMyLS4wOC42LS4yNC44My0uMTYuMjMtLjM5LjQxLS42OS41NC0uMy4xMy0uNjcuMTktMS4xLjE5WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTIuNTgsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE1NS45MywxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE2NC4wNCwxOC4zOWMtLjQ5LDAtLjkyLS4xMS0xLjI5LS4zMi0uMzctLjIxLS42Ny0uNTItLjg4LS45Mi0uMjEtLjQtLjMyLS44OC0uMzItMS40NHMuMS0xLjA0LjI5LTEuNDYuNDctLjc0LjgzLS45OGMuMzYtLjI0LjgtLjM1LDEuMzEtLjM1cy45Mi4xMSwxLjI2LjMyYy4zNC4yMS42LjUyLjc4LjkxLjE4LjM5LjI3Ljg1LjI3LDEuMzh2LjM1aC0zLjc4YzAsLjMzLjA1LjYzLjE3LjkuMTEuMjcuMjguNDkuNS42NS4yMi4xNi41MS4yNC44NS4yNHMuNjMtLjA4Ljg3LS4yMy40LS4zOC40Ny0uNjhoLjg5Yy0uMDYuMzYtLjIuNjYtLjQzLjktLjIyLjI0LS40OS40My0uOC41NS0uMzEuMTItLjY0LjE5LS45OC4xOVptLTEuNTMtMy4xNmgyLjg2YzAtLjMtLjA1LS41OC0uMTUtLjgyLS4xLS4yNC0uMjYtLjQ0LS40Ny0uNTgtLjIxLS4xNC0uNDctLjIxLS43OS0uMjFzLS42LjA4LS44Mi4yNC0uMzguMzYtLjQ4LjYxLS4xNi41LS4xNS43NloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTE1LjAyLDI4LjY5di03LjM3aC45NHYzLjE0aDMuOTh2LTMuMTRoLjk0djcuMzdoLS45NHYtMy40aC0zLjk4djMuNGgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjQuNjcsMjguNzljLS40OSwwLS45MS0uMS0xLjI3LS4zMS0uMzYtLjIxLS42NC0uNTItLjg0LS45Mi0uMi0uNC0uMy0uOS0uMy0xLjQ4LDAtLjU1LjA5LTEuMDMuMjgtMS40NS4xOS0uNDIuNDYtLjc0LjgyLS45N3MuOC0uMzQsMS4zMi0uMzRjLjQ5LDAsLjkxLjExLDEuMjYuMzIuMzYuMjEuNjMuNTIuODMuOTMuMi40MS4zLjkxLjMsMS41LDAsLjU0LS4wOSwxLjAxLS4yOCwxLjQyLS4xOC40MS0uNDUuNzMtLjgxLjk2LS4zNi4yMy0uNzkuMzQtMS4zMi4zNFptMC0uNzRjLjMxLDAsLjU4LS4wOC43OS0uMjRzLjM4LS4zOS41LS42OWMuMTEtLjMuMTctLjY1LjE3LTEuMDcsMC0uMzgtLjA1LS43Mi0uMTUtMS4wMnMtLjI2LS41NC0uNDctLjcyLS40OS0uMjctLjg0LS4yN2MtLjMyLDAtLjU5LjA4LS44MS4yNHMtLjM5LjM5LS41LjY5Yy0uMTEuMy0uMTcuNjYtLjE3LDEuMDgsMCwuMzcuMDUuNzEuMTUsMS4wMS4xLjMuMjYuNTQuNDguNzIuMjIuMTguNS4yNi44NS4yNloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTMwLjQ1LDI4Ljc5Yy0uNDgsMC0uOS0uMS0xLjI2LS4zMXMtLjY1LS41MS0uODYtLjkyYy0uMjEtLjQtLjMxLS45LS4zMS0xLjQ5LDAtLjU1LjA5LTEuMDMuMjgtMS40NC4xOS0uNDEuNDYtLjc0LjgzLS45Ny4zNi0uMjMuOC0uMzUsMS4zMi0uMzUuMzgsMCwuNzIuMDcsMS4wMi4yMnMuNTUuMzUuNzQuNjFjLjE5LjI3LjMxLjU4LjM2Ljk0aC0uODRjLS4wMy0uMTktLjEtLjM2LS4yMS0uNTEtLjExLS4xNS0uMjUtLjI4LS40My0uMzdzLS4zOS0uMTQtLjYzLS4xNGMtLjQ1LDAtLjgyLjE2LTEuMS40OS0uMjguMzMtLjQzLjgzLS40MywxLjUsMCwuNjEuMTMsMS4wOS4zOSwxLjQ2LjI2LjM3LjY0LjU1LDEuMTUuNTUuMjQsMCwuNDUtLjA1LjYzLS4xNC4xOC0uMDkuMzItLjIyLjQzLS4zN3MuMTgtLjMyLjIxLS41aC44MmMtLjA0LjM1LS4xNi42Ni0uMzYuOTItLjIuMjYtLjQ0LjQ2LS43NC42LS4zLjE0LS42NC4yMS0xLjAxLjIxWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMzMuOCwyOC42OXYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MS41MiwyOC43OWMtLjM3LDAtLjcxLS4wNi0xLjAyLS4xNy0uMzEtLjExLS41OC0uMjktLjc4LS41NC0uMjEtLjI0LS4zNC0uNTUtLjM5LS45M2guODZjLjA0LjIxLjEzLjM4LjI1LjUyLjEyLjE0LjI4LjI0LjQ3LjMxLjE5LjA3LjM5LjEuNjEuMS4zNiwwLC42NC0uMDcuODYtLjIuMjItLjEzLjMzLS4zNC4zMy0uNjEsMC0uMTktLjA2LS4zNS0uMTctLjQ3LS4xMS0uMTItLjI5LS4yLS41My0uMjZsLTEuMDktLjI3Yy0uNDItLjEtLjc2LS4yNi0xLjAyLS40OC0uMjUtLjIyLS4zOC0uNTItLjM4LS45MSwwLS4zMS4wNy0uNTguMjItLjgycy4zNy0uNDIuNjctLjU2Yy4zLS4xNC42Ny0uMiwxLjExLS4yLjU3LDAsMS4wNC4xMywxLjM5LjM5LjM1LjI2LjUzLjYzLjU1LDEuMTNoLS44NGMtLjAzLS4yNS0uMTUtLjQ1LS4zNC0uNi0uMTktLjE1LS40NS0uMjItLjc3LS4yMnMtLjYxLjA3LS44Mi4yYy0uMjEuMTMtLjMyLjM0LS4zMi42MiwwLC4xOS4wOC4zMy4yMy40NC4xNS4xMS4zNy4yLjY2LjI3bDEuMDYuMjdjLjI0LjA2LjQ0LjE1LjYuMjUuMTYuMTEuMjkuMjIuMzguMzVzLjE2LjI2LjIuNDEuMDYuMjguMDYuNDFjMCwuMzItLjA4LjYtLjI0LjgzLS4xNi4yMy0uMzkuNDEtLjY5LjU0LS4zLjEzLS42Ny4xOS0xLjEuMTlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni45MSwyOC43OWMtLjQ4LDAtLjktLjEtMS4yNi0uMzFzLS42NS0uNTEtLjg2LS45MmMtLjIxLS40LS4zMS0uOS0uMzEtMS40OSwwLS41NS4wOS0xLjAzLjI4LTEuNDQuMTktLjQxLjQ2LS43NC44My0uOTcuMzYtLjIzLjgtLjM1LDEuMzItLjM1LjM4LDAsLjcyLjA3LDEuMDIuMjJzLjU1LjM1Ljc0LjYxYy4xOS4yNy4zMS41OC4zNi45NGgtLjg0Yy0uMDMtLjE5LS4xLS4zNi0uMjEtLjUxLS4xMS0uMTUtLjI1LS4yOC0uNDMtLjM3cy0uMzktLjE0LS42My0uMTRjLS40NSwwLS44Mi4xNi0xLjEuNDktLjI4LjMzLS40My44My0uNDMsMS41LDAsLjYxLjEzLDEuMDkuMzksMS40Ni4yNi4zNy42NC41NSwxLjE1LjU1LjI0LDAsLjQ1LS4wNS42My0uMTQuMTgtLjA5LjMyLS4yMi40My0uMzdzLjE4LS4zMi4yMS0uNWguODJjLS4wNC4zNS0uMTYuNjYtLjM2LjkyLS4yLjI2LS40NC40Ni0uNzQuNi0uMy4xNC0uNjQuMjEtMS4wMS4yMVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTUwLjI2LDI4LjY5di03LjU3aC45MnYzLjA4Yy4wOS0uMTUuMjEtLjI4LjM2LS40MS4xNS0uMTMuMzMtLjIzLjU0LS4zMS4yMS0uMDguNDYtLjEyLjc0LS4xMi4zNCwwLC42NS4wNi45My4xOS4yOC4xMy41LjMxLjY2LjU0cy4yNC41MS4yNC44NHYzLjc3aC0uOTR2LTMuNThjMC0uMzItLjExLS41Ni0uMzItLjczLS4yMi0uMTctLjUtLjI2LS44NC0uMjYtLjI0LDAtLjQ2LjA0LS42Ni4xMi0uMjEuMDgtLjM4LjE5LS41LjM1LS4xMy4xNS0uMTkuMzUtLjE5LjU5djMuNTJoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU4LjA4LDI4Ljc5Yy0uMjgsMC0uNTMtLjA0LS43OC0uMTItLjI0LS4wOC0uNDYtLjE5LS42NC0uMzQtLjE5LS4xNS0uMzMtLjM0LS40NC0uNTYtLjExLS4yMi0uMTYtLjQ4LS4xNi0uNzh2LTMuNThoLjk0djMuNDhjMCwuMzQuMTEuNjIuMzIuODQuMjEuMjEuNTMuMzIuOTYuMzIuMzksMCwuNy0uMS45NC0uMy4yNC0uMi4zNS0uNS4zNS0uOXYtMy40M2guOTR2NS4yN2gtLjc1bC0uMS0xLjAxYy0uMDYuMjctLjE3LjQ4LS4zMy42NC0uMTYuMTYtLjM0LjI4LS41Ni4zNnMtLjQ1LjExLS43LjExWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNjMuNDUsMjguNzZjLS4yOSwwLS41Mi0uMDQtLjY5LS4xMi0uMTgtLjA4LS4zMS0uMTgtLjQtLjMyLS4wOS0uMTMtLjE2LS4yOC0uMTktLjQ2LS4wMy0uMTctLjA1LS4zNS0uMDUtLjUzdi02LjIyaC45M3Y2LjEzYzAsLjI2LjA1LjQ2LjE2LjYuMS4xMy4yNS4yMS40NC4yMmguMjl2LjYyYy0uMDguMDItLjE2LjA0LS4yNC4wNi0uMDguMDItLjE2LjAyLS4yMy4wMloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTY3LjE5LDI4Ljc5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMTUuMDIsMzkuMXYtNy4zN2guOWwzLjg5LDUuNzN2LTUuNzNoLjk0djcuMzdoLS44NGwtMy45Ni01LjgxdjUuODFoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI0LjQ1LDM5LjJjLS4yOCwwLS41My0uMDQtLjc4LS4xMi0uMjQtLjA4LS40Ni0uMTktLjY0LS4zNC0uMTktLjE1LS4zMy0uMzQtLjQ0LS41Ni0uMTEtLjIyLS4xNi0uNDgtLjE2LS43OHYtMy41OGguOTR2My40OGMwLC4zNC4xMS42Mi4zMi44NC4yMS4yMS41My4zMi45Ni4zMi4zOSwwLC43LS4xLjk0LS4zLjI0LS4yLjM1LS41LjM1LS45di0zLjQzaC45NHY1LjI3aC0uNzVsLS4xLTEuMDFjLS4wNi4yNy0uMTcuNDgtLjMzLjY0LS4xNi4xNi0uMzQuMjgtLjU2LjM2cy0uNDUuMTEtLjcuMTFabS0xLjI0LTYuNTZ2LS45MWguOTN2LjkxaC0uOTNabTEuOTgsMHYtLjkxaC45M3YuOTFoLS45M1oiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI4LjQ5LDM5LjF2LTUuMjdoLjl2MS4wMWMuMDktLjI1LjIxLS40Ni4zNy0uNjIuMTYtLjE3LjM0LS4yOS41NS0uMzcuMjEtLjA4LjQyLS4xMi42NC0uMTIuMDgsMCwuMTUsMCwuMjMuMDIuMDguMDEuMTMuMDMuMTcuMDV2LjkxYy0uMDUtLjAyLS4xMi0uMDQtLjItLjA1cy0uMTUtLjAxLS4yLS4wMWMtLjIxLS4wMS0uNDEsMC0uNTkuMDRzLS4zNC4xMS0uNDguMmMtLjE0LjEtLjI1LjIyLS4zMy4zOC0uMDguMTUtLjEyLjM0LS4xMi41NnYzLjI4aC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMi40OCwzOS4xdi01LjI3aC45MnYuNzZjLjA4LS4xNS4yLS4yOC4zNS0uNDEuMTUtLjEzLjMzLS4yMy41NS0uMzFzLjQ2LS4xMi43NS0uMTJjLjMzLDAsLjY0LjA3LjkyLjJzLjUuMzQuNjcuNjJjLjE3LjI4LjI1LjY0LjI1LDEuMDh2My40NWgtLjk0di0zLjM1YzAtLjQxLS4xMS0uNzItLjMyLS45Mi0uMjItLjItLjUtLjMtLjg0LS4zLS4yNCwwLS40Ni4wNC0uNjcuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OHYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MC45NywzOS4yYy0uMzEsMC0uNTctLjA0LS43OC0uMTItLjIxLS4wOC0uMzktLjE5LS41Mi0uMzEtLjE0LS4xMy0uMjQtLjI2LS4zMi0uMzktLjA4LS4xMy0uMTMtLjI1LS4xNi0uMzVsLS4xLDEuMDhoLS43MnYtNy41N2guOTV2My4xNGMuMDQtLjA5LjExLS4xOS4yLS4yOS4wOS0uMS4yMS0uMjEuMzUtLjMxcy4zMS0uMTguNTEtLjI0Yy4yLS4wNi40Mi0uMS42Ny0uMS42NiwwLDEuMTguMjMsMS41Ny42OS4zOS40Ni41OCwxLjEzLjU4LDIuMDMsMCwuNTUtLjA4LDEuMDQtLjI1LDEuNDUtLjE3LjQxLS40MS43My0uNzQuOTYtLjMzLjIzLS43NC4zNC0xLjIzLjM0Wm0tLjE3LS43MmMuNDMsMCwuNzgtLjE3LDEuMDQtLjUuMjctLjMzLjQtLjg2LjQtMS41OCwwLS42Mi0uMTItMS4wOS0uMzgtMS40My0uMjUtLjM0LS42MS0uNTEtMS4wOS0uNTEtLjM1LDAtLjYzLjA4LS44NC4yMy0uMjEuMTUtLjM3LjM3LS40Ny42Ni0uMS4yOS0uMTUuNjQtLjE2LDEuMDUsMCwuNzQuMTIsMS4yNy4zNCwxLjU5LjIzLjMyLjYxLjQ5LDEuMTQuNDlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni42NywzOS4yYy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTAuMjEsMzkuMXYtNS4yN2guOXYxLjAxYy4wOS0uMjUuMjEtLjQ2LjM3LS42Mi4xNi0uMTcuMzQtLjI5LjU1LS4zNy4yMS0uMDguNDItLjEyLjY0LS4xMi4wOCwwLC4xNSwwLC4yMy4wMi4wOC4wMS4xMy4wMy4xNy4wNXYuOTFjLS4wNS0uMDItLjEyLS4wNC0uMi0uMDVzLS4xNS0uMDEtLjItLjAxYy0uMjEtLjAxLS40MSwwLS41OS4wNHMtLjM0LjExLS40OC4yYy0uMTQuMS0uMjUuMjItLjMzLjM4LS4wOC4xNS0uMTIuMzQtLjEyLjU2djMuMjhoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU2LjI3LDQwLjg0Yy0uODMsMC0xLjQ3LS4xMi0xLjkzLS4zNi0uNDYtLjI0LS42OS0uNTgtLjY5LTEuMDMsMC0uMTkuMDQtLjM1LjEzLS40OS4wOS0uMTMuMTktLjI1LjMyLS4zMy4xMi0uMDkuMjQtLjE2LjM0LS4yMS4xLS4wNS4xNy0uMDkuMi0uMTEtLjA2LS4wMy0uMTMtLjA4LS4yMS0uMTMtLjA4LS4wNS0uMTYtLjEyLS4yMy0uMnMtLjEtLjItLjEtLjMzYzAtLjE3LjA4LS4zMi4yMy0uNDYuMTYtLjE0LjM5LS4yNC43LS4zMS0uMzEtLjE2LS41NS0uMzYtLjcyLS42Mi0uMTctLjI2LS4yNi0uNTQtLjI2LS44NCwwLS4zNC4wOS0uNjQuMjgtLjg5LjE4LS4yNS40NS0uNDQuNzktLjU4LjM0LS4xMy43NS0uMiwxLjIzLS4yLjM0LDAsLjYzLjA0Ljg2LjEyLjIzLjA4LjQ1LjE5LjY1LjM0LjA1LS4wMi4xNC0uMDYuMjYtLjExLjEyLS4wNS4yNS0uMS4zOS0uMTYuMTQtLjA2LjI3LS4xMS40LS4xN3MuMjItLjA5LjMtLjEydi44N3MtLjkzLjE3LS45My4xN2MuMDUuMTEuMS4yMy4xMy4zNi4wMy4xMy4wNC4yNS4wNC4zNiwwLC4zMS0uMDguNTktLjI0Ljg0LS4xNi4yNS0uNDEuNDUtLjczLjYtLjMzLjE1LS43My4yMi0xLjIyLjIyLS4wNCwwLS4wOSwwLS4xNiwwLS4wNiwwLS4xMiwwLS4xNiwwLS4zNiwwLS42MS4wNS0uNzQuMTItLjEzLjA3LS4yLjE1LS4yLjIzLDAsLjEuMDguMTcuMjMuMi4xNS4wNC40MS4wNy43OC4xLjEzLDAsLjMuMDEuNDkuMDMuMiwwLC40MS4wMi42Ni4wNC41NS4wMy45OC4xNywxLjI3LjQycy40NS41OC40NSwxYzAsLjQ4LS4yMS44Ny0uNjQsMS4xNy0uNDMuMy0xLjA4LjQ1LTEuOTUuNDVabS4xNy0uNjFjLjQ5LDAsLjg2LS4wNywxLjEyLS4yMi4yNi0uMTUuMzktLjM3LjM5LS42NiwwLS4yMS0uMDgtLjM4LS4yNC0uNTEtLjE2LS4xNC0uNC0uMjEtLjcyLS4yM2wtMS40OC0uMWMtLjEzLDAtLjI3LjAzLS40MS4xLS4xNC4wNy0uMjYuMTctLjM2LjNzLS4xNS4yOC0uMTUuNDRjMCwuMjguMTUuNS40NS42NS4zLjE2Ljc3LjIzLDEuNC4yM1ptLS4xNi0zLjc2Yy4zOCwwLC42OC0uMDkuOTItLjI3LjIzLS4xOC4zNS0uNDQuMzUtLjc4cy0uMTItLjYyLS4zNS0uODEtLjU0LS4yOC0uOTItLjI4LS43LjA5LS45NC4yOC0uMzUuNDYtLjM1LjgxYzAsLjMzLjExLjU5LjM0Ljc3LjIzLjE4LjU0LjI4Ljk1LjI4WiIgZmlsbD0iI2M3MjQyNiIvPjwvZz48Zz48cGF0aCBkPSJtNTcuODMsMjEuODZjLjEzLTUuNS0zLjExLTEwLjQ4LTguODctMTEuMTQtMi43NC0uMjQtNS42My43NS03Ljc5LDIuNSwwLS4yOSwwLS41Ny4wMy0uODYuMDctMy4wOC4xMi05LjI4LjEtMTIuMzZoLTYuMDJ2MzkuMWg2LjAyczAtMTAuOTgsMC0xNC4zN2gwczAtMS4zNSwwLTIuNjRjLjA2LTEuNzQuMzktMy41NiwxLjcxLTQuNTcsMS41Ni0xLjE4LDQuMzktMS4zOCw2LjE4LS41OCwxLjUyLjcyLDIuMDksMS44MSwyLjQ4LDMuNDguMS42NS4xNywyLjI3LjE3LDQuMzIsMCw0LjY5LS4wOCwxMy4wOS0uMDIsMTQuMzYsMCwwLDYuMDIsMCw2LjAyLDAtLjAxLTEuMi4wMi0xNi40MywwLTE3LjI0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMDEuNjYsMzMuNDJzLS4wNSwwLS4wOC4wMWMwLTQuODQuMDEtMTEuMDYsMC0xMS41Ny4xNy01LjI5LTMuMTctMTAuNzctOC44Ni0xMS4xOC0zLjU1LS4yOC03LjYxLjk4LTkuODEsMy45MS0xLjUyLTIuMTEtMy44LTMuNjEtNi43Mi0zLjkyLS45Mi0uMDUtMS44NS4wMi0yLjc3LjIxLTEuODMuMzUtMy41OSwxLjE4LTUuMDMsMi4zNC0uMDItLjgzLS4wMi0xLjY1LDAtMi40OGgtNS45djI4LjM2aDYuMDJsLjAyLTcuMDl2LTcuMDljMC0uMzksMC0yLjgyLDAtMywwLS42Mi4wNy0xLjA4LjE0LTEuNDcuMTMtLjcuMzQtMS4zNy42OC0xLjk0LjE2LS4yNi4zNC0uNS41Ni0uNzIuMDEtLjAxLjIyLS4xOS4zMS0uMjcsMS4yLS44OCwyLjgzLTEuMTUsNC4zMS0xLjAzLjY4LjA2LDEuMzIuMjEsMS44Ny40NS43Ni4zNiwxLjI4LjgxLDEuNjcsMS4zOC4xMi4xOS4yMy4zOS4zMy42LjIuNDQuMzYuOTMuNDksMS41LjAzLjE2LjA1LjM4LjA3LjY0LDAsLjA5LjAxLjE4LjAyLjI4LjAxLjI2LjAzLjU1LjA0Ljg3LDAsLjAxLDAsLjAyLDAsLjAzLDAsLjI3LjAyLDEuMzEuMDIsMS40OS4wMywzLjQ0LDAsNi44NywwLDEwLjMxLDAsLjI0LDAsNS4wNSwwLDUuMDUsMCwwLDEuNywwLDMuMjksMCwuMzcsMCwuNzQsMCwxLjA4LDBzLjY1LDAsLjkxLDBoLjc0czAtLjAzLDAtLjA0aDBzMC0zLjIyLDAtNi43YzAtMS4xNiwwLTIuMzcsMC0zLjU0LDAtLjI1LDAtMy41OCwwLTQuNjYsMC0uMTgsMC0uNTEsMC0uNTEsMCwwLDAtMS40NCwwLTEuNDgsMC0xLjMzLjI4LTMsMS4wMy0zLjk1LDEuMDItMS4zMiwyLjUzLTEuNjgsNC4yNi0xLjczLDEuNjktLjA2LDMuMzEuNDIsNC4yLDEuNzUuNjQuODgsMS4wMiwyLjM3LDEuMDMsMy42MnYxLjkyczAsMTUuMzIsMCwxNS4zMmMwLDAsNi4wMiwwLDYuMDIsMGgwczYuMSwwLDYuMSwwdi02LjAyYy0xLjc0LS4wMi0zLjg5LS4wNy02LjAzLjM0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNy4yNSwxMC4zN2gwYy02LjAzLjA4LTExLjQ3LDIuODYtMTMuMzYsOC45LTEuNDEsNC40NC0uOTcsOS4xMywxLjUzLDEzLjExLjIzLjM1LjQ5LjY4Ljc3Ljk5LTIuMDUtLjM2LTQuMTEtLjMyLTYuMTgtLjN2Ni4wMmgxNS4yN3YtNS44MmMtNC4zMS0uNTgtNS45OC0zLjUtNi4wMy04LjY4LS4xNS01LjcxLDIuNDktOC44LDguMDItOC45MmgwYzMuNTUuMDQsNi43MSwxLjY3LDcuNTksNS4yNi42LDIuMjMuNTYsNS4yMi4wMyw3LjQ1LS43LDMuMTEtMi44Nyw0LjUyLTUuNjQsNC44OXY1LjY4YzEuMS0uMTIsMi4yMy0uMzIsMy4zOC0uNjcsOC4xLTIuMzcsMTAuMi0xMS43MSw3Ljk3LTE4Ljk5LTEuOTEtNi03LjMyLTguODMtMTMuMzMtOC45MloiIGZpbGw9IiNjNzI0MjYiLz48L2c+PC9nPjwvZz48L3N2Zz4=";
function fmtTime(s) {
  if (!isFinite(s)) return "—";
  if (s < 60) return `${s.toFixed(0)} s`;
  if (s < 3600) return `${(s / 60).toFixed(2)} min`;
  return `${(s / 3600).toFixed(2)} h`;
}
function hexToRgb(hex) {
  const m = hex.replace("#", "");
  return { r: parseInt(m.substring(0, 2), 16), g: parseInt(m.substring(2, 4), 16), b: parseInt(m.substring(4, 6), 16) };
}
function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}
function yeq(x, alpha) { return (alpha * x) / (1 + (alpha - 1) * x); }
function xFromY(y, alpha) { return y / (alpha - (alpha - 1) * y); }
function buildStaircase(xD, opSlope, opIntercept, alpha, xTarget, maxSteps) {
  const pts = [{ x: xD, y: xD }];
  let x = xD, y = xD, steps = 0, reached = false;
  for (let i = 0; i < maxSteps; i++) {
    const xEq = Math.max(0, Math.min(1, xFromY(y, alpha)));
    pts.push({ x: xEq, y });
    steps++;
    if (xEq <= xTarget || xEq <= 0.0005) { reached = true; break; }
    const yNext = Math.max(0, Math.min(1, opSlope * xEq + opIntercept));
    pts.push({ x: xEq, y: yNext });
    x = xEq; y = yNext;
  }
  return { pts, steps, reached };
}
const logToPos = (val, min, max) => (100 * Math.log(val / min)) / Math.log(max / min);
const posToLog = (pos, min, max) => min * Math.pow(max / min, pos / 100);

/* ---------------------------------------------------------------------
   CONTROL WIDGETS
--------------------------------------------------------------------- */
function Field({ label, value, locked, children }) {
  return (
    <div className="mb-3" style={{ opacity: locked ? 0.5 : 1 }}>
      <div className="flex items-baseline justify-between mb-1">
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.02em", color: GRAY, fontWeight: 500 }}>
          {label}{locked ? " 🔒" : ""}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK, fontWeight: 700 }}>{value}</span>
      </div>
      {children}
    </div>
  );
}
function LinearSlider({ min, max, step, value, onChange, disabled }) {
  return <input className="ohm-slider" type="range" min={min} max={max} step={step} value={value} disabled={disabled}
    onChange={(e) => onChange(parseFloat(e.target.value))} />;
}
function LogSlider({ min, max, value, onChange, disabled }) {
  const pos = logToPos(value, min, max);
  return <input className="ohm-slider" type="range" min={0} max={100} step={0.1} value={pos} disabled={disabled}
    onChange={(e) => onChange(posToLog(parseFloat(e.target.value), min, max))} />;
}
function PanelBox({ title, children }) {
  return (
    <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.03em", color: INK, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${OHM_RED}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------
   KOLONNEN-ANIMATION
--------------------------------------------------------------------- */
function ColumnGraphic({ xArr, N, TA, TB, running }) {
  const colX = 60, colY = 14, colW = 90, colH = 292;
  const segs = xArr.length; // N+2
  const segH = colH / segs;
  const PIPE = "#B9B7B4";

  const labelFor = (i) => (i === 0 ? "Sumpf" : i === segs - 1 ? "Kopf" : `B${i}`);

  return (
    <svg viewBox="0 0 240 340" style={{ width: "100%", height: "100%" }}>
      {/* Rücklauf (Kopf -> oberster Boden) */}
      <line x1={colX + colW + 14} y1={colY + 8} x2={colX + colW} y2={colY + 8} stroke={PIPE} strokeWidth={5} />
      {/* Feed-Pfeil */}
      <line x1={colX - 26} y1={colY + colH - 0.5 * segH} x2={colX} y2={colY + colH - 0.5 * segH} stroke={OHM_RED} strokeWidth={running ? 4 : 2} opacity={running ? 1 : 0.4} />
      <text x={colX - 30} y={colY + colH - 0.5 * segH + 4} textAnchor="end" fontFamily={SANS} fontWeight="700" fontSize="10" fill={OHM_RED}>Feed</text>

      {/* Säule: vom Sumpf (unten, i=0) zum Kopf (oben, i=segs-1) */}
      {xArr.map((xv, i) => {
        const color = lerpColor(PALE, OHM_BLUE, Math.max(0, Math.min(1, xv)));
        const y = colY + colH - (i + 1) * segH;
        return (
          <g key={i}>
            <rect x={colX} y={y} width={colW} height={segH} fill={color} stroke="#fff" strokeWidth={1} />
            <text x={colX + 6} y={y + segH / 2 + 3} fontFamily={MONO} fontSize="8.5" fill={xv > 0.55 ? "#fff" : INK} opacity={0.9}>
              {labelFor(i)}
            </text>
          </g>
        );
      })}
      <rect x={colX} y={colY} width={colW} height={colH} fill="none" stroke={PIPE} strokeWidth={3} rx="3" />

      {/* Destillat-Abzug */}
      <line x1={colX + colW} y1={colY + 8} x2={colX + colW + 26} y2={colY + 8} stroke={OHM_BLUE} strokeWidth={running ? 4 : 2} opacity={running ? 1 : 0.4} />
      <text x={colX + colW + 30} y={colY + 4} fontFamily={SANS} fontWeight="700" fontSize="9" fill={OHM_BLUE}>Destillat</text>

      {/* Sumpf-Abzug */}
      <line x1={colX + colW} y1={colY + colH - 8} x2={colX + colW + 26} y2={colY + colH - 8} stroke={OHM_RED} strokeWidth={running ? 4 : 2} opacity={running ? 1 : 0.4} />
      <text x={colX + colW + 30} y={colY + colH - 4} fontFamily={SANS} fontWeight="700" fontSize="9" fill={OHM_RED}>Sumpf</text>
    </svg>
  );
}

/* ---------------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------------- */
export default function RectificationColumn() {
  const [N, setN] = useState(8);
  const [F, setF] = useState(100);
  const [xF, setXF] = useState(0.5);
  const [R, setR] = useState(2.0);
  const [D, setD] = useState(45);
  const [alpha, setAlpha] = useState(2.5);
  const [TA, setTA] = useState(80.1);
  const [TB, setTB] = useState(110.6);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false); // N und Feed-Boden gesperrt nach Start
  const [, setTick] = useState(0);

  const paramsRef = useRef({});
  paramsRef.current = { N, F, xF, R, D, alpha, speed };

  const elapsedRef = useRef(0);
  const xArrRef = useRef(new Array(N + 2).fill(0.5));
  const histRef = useRef([{ t: 0, xD: 0.5, xB: 0.5 }]);
  const windowWidthRef = useRef(200);

  const estimateWindow = useCallback((p) => {
    const L = p.R * p.D, V = L + p.D, B = Math.max(1, p.F - p.D);
    const rateMax = Math.max((L + V) / H, V / H, B / H) || 0.05;
    return Math.min(3000, Math.max(60, (8 * (p.N + 2)) / rateMax));
  }, []);

  const initRun = useCallback(() => {
    const p = paramsRef.current;
    elapsedRef.current = 0;
    xArrRef.current = new Array(p.N + 2).fill(p.xF);
    histRef.current = [{ t: 0, xD: p.xF, xB: p.xF }];
    windowWidthRef.current = estimateWindow(p);
    setTick((t) => t + 1);
  }, [estimateWindow]);

  useEffect(() => { initRun(); }, []); // eslint-disable-line
  useEffect(() => { if (!locked) initRun(); }, [N]); // eslint-disable-line
  useEffect(() => { if (D >= F) setD(Math.max(5, F - 1)); }, [F]); // eslint-disable-line

  useEffect(() => {
    if (!running) return;
    let raf, last = performance.now(), frame = 0;
    const step = (now) => {
      const dtReal = Math.min(now - last, 100) / 1000;
      last = now;
      const p = paramsRef.current;
      const dtSim = dtReal * p.speed;
      elapsedRef.current += dtSim;
      const t = elapsedRef.current;

      const L = p.R * p.D;
      const V = L + p.D;
      const Dsafe = Math.min(p.D, p.F * 0.999);
      const B = p.F - Dsafe;

      const rateMax = Math.max((L + V) / H, V / H, B / H || 0);
      const subDt = EULER_RATIO / rateMax;
      const steps = Math.min(3000, Math.max(1, Math.round(dtSim / subDt)));
      const actualSub = dtSim / steps;

      let x = xArrRef.current.slice();
      const N2 = p.N;
      for (let s = 0; s < steps; s++) {
        const y = x.map((v) => yeq(v, p.alpha));
        const nx = new Array(N2 + 2);
        nx[0] = x[0] + (actualSub * (L * x[1] + p.F * p.xF - B * x[0] - V * y[0])) / H;
        for (let j = 1; j <= N2; j++) {
          nx[j] = x[j] + (actualSub * (L * x[j + 1] + V * y[j - 1] - L * x[j] - V * y[j])) / H;
          nx[j] = Math.max(0, Math.min(1, nx[j]));
        }
        nx[N2 + 1] = x[N2 + 1] + (actualSub * (V * y[N2] - V * x[N2 + 1])) / H;
        nx[0] = Math.max(0, Math.min(1, nx[0]));
        nx[N2 + 1] = Math.max(0, Math.min(1, nx[N2 + 1]));
        x = nx;
      }
      xArrRef.current = x;

      const arr = histRef.current;
      arr.push({ t, xD: x[N2 + 1], xB: x[0] });
      const minKeep = t - windowWidthRef.current * 1.5;
      while (arr.length > 2 && arr[0].t < minKeep) arr.shift();

      windowWidthRef.current = Math.max(windowWidthRef.current, estimateWindow(p));
      frame++;
      if (frame % 3 === 0) setTick((x2) => x2 + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, estimateWindow]);

  const handlePlayPause = () => {
    if (!running) setLocked(true);
    setRunning((r) => !r);
  };
  const handleReset = () => { setRunning(false); setLocked(false); initRun(); };

  const exportCSV = () => {
    const csvNum = (x) => (x === null || x === undefined || Number.isNaN(x) ? "" : x.toFixed(5).replace(".", ","));
    const p = paramsRef.current;
    const meta = [
      `# Rektifikations-Monitor Messexport`,
      `# N=${p.N}; Zulauf direkt in den Sumpf; F=${p.F} mol/h; xF=${p.xF}; R=${p.R}; D=${p.D} mol/h; alpha=${p.alpha}; TA=${TA}C; TB=${TB}C`,
      `# Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
      ``,
      `Zeit_s;x_Destillat_Prozent;x_Sumpf_Prozent`,
      ...histRef.current.map((pt) => `${csvNum(pt.t)};${csvNum(pt.xD * 100)};${csvNum(pt.xB * 100)}`),
      ``,
      `Bodenprofil_aktuell (0=Sumpf ... N+1=Kopf/Destillat)`,
      `Boden;x_Prozent;y_Prozent;T_C`,
      ...xArrRef.current.map((xv, i) => {
        const yv = yeq(xv, p.alpha) * 100;
        const Tv = xv * TA + (1 - xv) * TB;
        return `${i};${csvNum(xv * 100)};${csvNum(yv)};${csvNum(Tv)}`;
      }),
    ];
    const csvContent = "\uFEFF" + meta.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rektifikation_messdaten_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const elapsed = elapsedRef.current;
  const ww = windowWidthRef.current;
  const xDomain = elapsed <= ww ? [0, ww] : [elapsed - ww, elapsed];
  const xArr = xArrRef.current;
  const xD = xArr[N + 1], xB = xArr[0];
  const L = R * D, V = L + D, B = F - D;
  const invalid = D >= F;

  // McCabe-Thiele Diagramm (Verstärkungsteil)
  const eqCurve = [];
  for (let i = 0; i <= 50; i++) { const xv = i / 50; eqCurve.push({ x: xv * 100, y: yeq(xv, alpha) * 100 }); }
  const diagonal = [{ x: 0, y: 0 }, { x: 100, y: 100 }];
  const opSlope = L / V, opIntercept = (D / V) * xD;
  const operatingLine = [{ x: 0, y: opIntercept * 100 }, { x: 100, y: Math.min(150, (opSlope + opIntercept) * 100) }];
  const { pts: staircasePts, steps: theoreticalStages, reached: staircaseReached } = buildStaircase(xD, opSlope, opIntercept, alpha, xB, 25);
  const staircaseData = staircasePts.map((p) => ({ x: p.x * 100, y: p.y * 100 }));
  const stagePoints = xArr.map((xv) => ({ x: xv * 100, y: yeq(xv, alpha) * 100 }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "6px 10px", fontFamily: MONO, fontSize: 11, color: INK, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
        <div style={{ opacity: 0.6, marginBottom: 4 }}>t = {fmtTime(label)}</div>
        {payload.map((p) => (
          <div key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {p.value?.toFixed(2)} %</div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center p-3 md:p-6" style={{ background: BG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        input.ohm-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; background-color:#DEDCDA; cursor:pointer; }
        input.ohm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
          background: ${OHM_RED}; border:2px solid #fff; box-shadow:0 0 0 1px ${PANEL_BORDER}, 0 1px 3px rgba(0,0,0,.25); cursor:pointer; }
        input.ohm-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background: ${OHM_RED}; border:2px solid #fff; cursor:pointer; }
        input.ohm-slider::-moz-range-track { background:#DEDCDA; height:4px; border-radius:2px; }
        input.ohm-slider:disabled::-webkit-slider-thumb { background: #B9B7B4; }
        input.ohm-slider:disabled::-moz-range-thumb { background: #B9B7B4; }
        input.ohm-slider:disabled { cursor: not-allowed; }
        .led { animation: pulseGlow 1.1s ease-in-out infinite; }
        @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:.35} }
        @media (prefers-reduced-motion: reduce) { .led { animation: none; } }
        .ohm-btn:active { transform: translateY(1px); }
        table.stage-table { width: 100%; border-collapse: collapse; font-family: ${MONO}; font-size: 11px; }
        table.stage-table th { text-align: right; color: ${GRAY}; font-weight: 600; padding: 3px 6px; border-bottom: 1px solid ${PANEL_BORDER}; }
        table.stage-table th:first-child, table.stage-table td:first-child { text-align: left; }
        table.stage-table td { text-align: right; padding: 3px 6px; color: ${INK}; }
        table.stage-table tr:nth-child(even) { background: #FAFAF9; }
      `}</style>

      <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1400, fontFamily: SANS }}>
        {/* HEADER */}
        <div className="flex items-end justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: `3px solid ${OHM_RED}` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={OHM_LOGO} alt="Ohm Angewandte Chemie" style={{ height: 34, width: "auto", display: "block" }} />
              <h1 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(24px,3.2vw,32px)", color: INK, letterSpacing: "-0.01em", lineHeight: 1 }}>
                REKTIFIKATIONS·MONITOR
              </h1>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: GRAY, marginTop: 6 }}>
              Fakultät Angewandte Chemie · Binäres Gemisch · Bodenkolonne mit Rücklauf · live integriert mit Systemträgheit
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="led" style={{ width: 10, height: 10, borderRadius: "50%",
              background: running ? "#2E9E4F" : OHM_RED, boxShadow: `0 0 6px ${running ? "#2E9E4F" : OHM_RED}` }} />
            <span style={{ fontFamily: SANS, fontSize: 12, color: INK, fontWeight: 600 }}>{running ? "Läuft" : "Angehalten"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT CONTROLS */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <PanelBox title="Kolonne">
              <Field label="Anzahl Böden N (Verstärkungsteil)" value={`${N}`} locked={locked}>
                <LinearSlider min={3} max={14} step={1} value={N} onChange={setN} disabled={locked} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>
                Zulauf erfolgt direkt in den Sumpf — kein separater Abtriebsteil. {locked ? "N für diesen Lauf gesperrt — erst nach 'Neuer Lauf' änderbar." : "Nur vor dem Start änderbar."}
              </div>
            </PanelBox>

            <PanelBox title="Feed (live änderbar)">
              <Field label="Feed-Strom F" value={`${F.toFixed(0)} mol/h`}>
                <LinearSlider min={20} max={300} step={5} value={F} onChange={setF} />
              </Field>
              <Field label="Feed-Zusammensetzung x_F" value={`${(xF * 100).toFixed(0)} %`}>
                <LinearSlider min={0.05} max={0.95} step={0.01} value={xF} onChange={setXF} />
              </Field>
            </PanelBox>

            <PanelBox title="Betrieb (live änderbar)">
              <Field label="Rücklaufverhältnis R = L/D" value={R.toFixed(2)}>
                <LogSlider min={0.3} max={10} value={R} onChange={setR} />
              </Field>
              <Field label="Destillatstrom D" value={`${D.toFixed(0)} mol/h`}>
                <LinearSlider min={5} max={Math.max(6, F - 1)} step={1} value={D} onChange={setD} />
              </Field>
              {invalid && <div style={{ fontFamily: SANS, fontSize: 11, color: OHM_RED, fontWeight: 700 }}>⚠ D ≥ F ist unphysikalisch (Sumpfstrom ≤ 0).</div>}
            </PanelBox>

            <PanelBox title="Stoffsystem (nur vor Start änderbar)">
              <Field label="Relative Flüchtigkeit α" value={alpha.toFixed(2)} locked={locked}>
                <LogSlider min={1.1} max={6} value={alpha} onChange={setAlpha} disabled={locked} />
              </Field>
              <Field label="Siedepunkt Leichtsieder A" value={`${TA.toFixed(1)} °C`} locked={locked}>
                <LinearSlider min={30} max={150} step={0.5} value={TA} onChange={setTA} disabled={locked} />
              </Field>
              <Field label="Siedepunkt Schwersieder B" value={`${TB.toFixed(1)} °C`} locked={locked}>
                <LinearSlider min={30} max={200} step={0.5} value={TB} onChange={setTB} disabled={locked} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>
                Standard: Benzol (80,1 °C) / Toluol (110,6 °C). T je Boden linear aus x interpoliert — vereinfacht, nicht aus Antoine-Gleichung.
                {locked && " Für diesen Lauf gesperrt — erst nach 'Neuer Lauf' änderbar."}
              </div>
            </PanelBox>

            <PanelBox title="Zeitraffer">
              <Field label="Beschleunigung" value={`× ${speed.toFixed(0)}`}>
                <LogSlider min={1} max={2000} value={speed} onChange={setSpeed} />
              </Field>
            </PanelBox>
          </div>

          {/* CENTER: COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div style={{ position: "relative", background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 8, height: 460 }}>
              <ColumnGraphic xArr={xArr} N={N} TA={TA} TB={TB} running={running} />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={handlePlayPause} className="ohm-btn" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.02em",
                background: running ? "#fff" : OHM_RED, color: running ? OHM_RED : "#fff", border: `2px solid ${OHM_RED}`, borderRadius: 5, padding: "9px 20px" }}>
                {running ? "⏸ PAUSE" : "▶ START"}
              </button>
              <button onClick={handleReset} className="ohm-btn" style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 16px", color: INK }}>
                ↺ Neuer Lauf
              </button>
              <button onClick={exportCSV} className="ohm-btn" style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 16px", color: INK }}>
                ⤓ CSV
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PanelBox title="Destillat x_D">
                <div style={{ fontFamily: MONO, fontSize: 18, color: OHM_BLUE, fontWeight: 700 }}>{(xD * 100).toFixed(2)} %</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: GRAY }}>T = {(xD * TA + (1 - xD) * TB).toFixed(1)} °C</div>
              </PanelBox>
              <PanelBox title="Sumpf x_B">
                <div style={{ fontFamily: MONO, fontSize: 18, color: OHM_RED, fontWeight: 700 }}>{(xB * 100).toFixed(2)} %</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: GRAY }}>T = {(xB * TA + (1 - xB) * TB).toFixed(1)} °C</div>
              </PanelBox>
            </div>
          </div>

          {/* RIGHT: CHART + TABLE */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div style={{ position: "relative", background: CHART_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "10px 8px 4px 0" }}>
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <ComposedChart margin={{ top: 10, right: 18, bottom: 22, left: 30 }}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="2 4" />
                    <XAxis dataKey="t" type="number" domain={xDomain} allowDataOverflow
                      tickFormatter={(v) => fmtTime(v)} stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      label={{ value: "Zeit", position: "insideBottom", offset: -14, fill: GRAY, fontSize: 12, fontFamily: SANS, fontWeight: 600 }} />
                    <YAxis type="number" domain={[0, 100]} stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      width={54}
                      label={{ value: "x (%)", angle: -90, position: "insideLeft", offset: 8, fill: INK, fontSize: 12.5, fontFamily: SANS, fontWeight: 600 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line data={histRef.current.map((p) => ({ t: p.t, v: p.xD * 100 }))} dataKey="v" stroke={OHM_BLUE} strokeWidth={2.5} dot={false} isAnimationActive={false} name="Destillat" />
                    <Line data={histRef.current.map((p) => ({ t: p.t, v: p.xB * 100 }))} dataKey="v" stroke={OHM_RED} strokeWidth={2.5} dot={false} isAnimationActive={false} name="Sumpf" />
                    <ReferenceLine y={xF * 100} stroke={GRAY} strokeDasharray="2 3" strokeOpacity={0.6} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY, paddingLeft: 4 }}>
              Blau = Destillat x_D, Rot = Sumpf x_B, grau gestrichelt = Feed-Zusammensetzung x_F
            </div>

            <PanelBox title="Bodenprofil (aktuell)">
              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                <table className="stage-table">
                  <thead>
                    <tr><th>Boden</th><th>x (%)</th><th>y (%)</th><th>T (°C)</th></tr>
                  </thead>
                  <tbody>
                    {xArr.slice().reverse().map((xv, ridx) => {
                      const i = xArr.length - 1 - ridx;
                      const label = i === 0 ? "Sumpf" : i === xArr.length - 1 ? "Kopf/Dest." : `Boden ${i}`;
                      const yv = yeq(xv, alpha) * 100;
                      const Tv = xv * TA + (1 - xv) * TB;
                      const isFeed = i === 0;
                      return (
                        <tr key={i} style={isFeed ? { outline: `1px solid ${OHM_RED}` } : undefined}>
                          <td>{label}{isFeed ? " ← F" : ""}</td>
                          <td>{(xv * 100).toFixed(1)}</td>
                          <td>{yv.toFixed(1)}</td>
                          <td>{Tv.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </PanelBox>

            <div className="grid grid-cols-2 gap-3">
              <PanelBox title="L / V (im ganzen Verstärkungsteil)">
                <div style={{ fontFamily: MONO, fontSize: 13, color: INK }}>{L.toFixed(0)} / {V.toFixed(0)}</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: GRAY }}>mol/h</div>
              </PanelBox>
              <PanelBox title="Sumpfstrom B">
                <div style={{ fontFamily: MONO, fontSize: 13, color: INK }}>{Math.max(0, B).toFixed(0)}</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: GRAY }}>mol/h</div>
              </PanelBox>
            </div>
          </div>
        </div>

        {/* MCCABE-THIELE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <div style={{ background: CHART_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "14px 12px 8px 4px" }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.03em", color: INK, textTransform: "uppercase", marginBottom: 8, paddingLeft: 8 }}>
                McCabe-Thiele-Diagramm (Verstärkungsteil)
              </div>
              <div style={{ width: "100%", height: 420 }}>
                <ResponsiveContainer>
                  <ComposedChart margin={{ top: 10, right: 18, bottom: 22, left: 30 }}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="2 4" />
                    <XAxis dataKey="x" type="number" domain={[0, 100]} stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      label={{ value: "x (Flüssigkeit, %)", position: "insideBottom", offset: -14, fill: GRAY, fontSize: 12, fontFamily: SANS, fontWeight: 600 }} />
                    <YAxis dataKey="y" type="number" domain={[0, 100]} stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      width={54}
                      label={{ value: "y (Dampf, %)", angle: -90, position: "insideLeft", offset: 8, fill: INK, fontSize: 12.5, fontFamily: SANS, fontWeight: 600 }} />
                    <Tooltip formatter={(v) => `${v.toFixed(1)} %`} contentStyle={{ fontFamily: MONO, fontSize: 11 }} />
                    <Line data={diagonal} dataKey="y" stroke={GRAY} strokeDasharray="2 3" strokeWidth={1.3} dot={false} isAnimationActive={false} name="y = x" />
                    <Line data={eqCurve} dataKey="y" stroke={INK} strokeWidth={2.2} dot={false} isAnimationActive={false} name="Gleichgewicht" />
                    <Line data={operatingLine} dataKey="y" stroke={OHM_RED} strokeDasharray="6 4" strokeWidth={2} dot={false} isAnimationActive={false} name="Arbeitslinie" />
                    <Line data={staircaseData} dataKey="y" stroke="#2E9E4F" strokeWidth={1.6} dot={false} isAnimationActive={false} name="Stufentreppe (theoretisch)" />
                    <Scatter data={stagePoints} dataKey="y" fill={OHM_BLUE} r={4} isAnimationActive={false} name="Böden (live simuliert)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <PanelBox title="Theoretische vs. vorhandene Böden">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: staircaseReached ? "#2E9E4F" : OHM_RED, fontWeight: 700 }}>
                    {staircaseReached ? theoreticalStages : `≥ ${theoreticalStages}`}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>
                    {staircaseReached ? "theoretisch nötig (aktuell, inkl. Sumpf)" : "kein Pinch-Ende gefunden — siehe Hinweis"}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: OHM_BLUE, fontWeight: 700 }}>{N + 1}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>vorhanden (N Böden + Sumpf)</div>
                </div>
              </div>
              {!staircaseReached && (
                <div style={{ fontFamily: SANS, fontSize: 11, color: OHM_RED, marginTop: 8, fontWeight: 600 }}>
                  ⚠ Treppe erreicht x_B nicht innerhalb von 25 Stufen — Arbeitslinie liegt nahe am Gleichgewicht (Pinch). Mit reinem Verstärkungsteil (Feed direkt in den Sumpf) ist diese Trennung hier ineffizient bzw. nahe der Mindestrücklauf-Grenze. R erhöhen oder x_B-Ziel lockern, um den Pinch aufzulösen.
                </div>
              )}
              <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY, marginTop: 8 }}>
                Die grüne Treppe wird aus der aktuellen Arbeitslinie (rot gestrichelt, Steigung L/V) und der Gleichgewichtskurve (schwarz) konstruiert — beginnend bei x_D auf der Diagonale. Der letzte Schritt in den Sumpf ist nur näherungsweise vergleichbar, da der Sumpf zusätzlich den Feed-Term erhält und damit nicht exakt auf derselben Arbeitslinie liegt. Die blauen Punkte sind die tatsächlich simulierten Böden; im eingeschwungenen Zustand liegen sie nahe der Treppe.
              </div>
            </PanelBox>
            <PanelBox title="Hinweis">
              <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>
                Während der Anlauf- bzw. Übergangsphase (Systemträgheit!) liegen die live simulierten Punkte noch nicht exakt auf der Treppe — sie wandern im Zeitverlauf dorthin, sobald sich der stationäre Zustand einstellt. Das macht den Unterschied zwischen der klassischen stationären McCabe-Thiele-Auslegung und der dynamischen Simulation sichtbar.
              </div>
            </PanelBox>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${PANEL_BORDER}`, paddingTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Modell: nur Verstärkungsteil — Zulauf F mit x_F direkt in den Sumpf, H·dxⱼ/dt = Zuflüsse − Abflüsse pro Boden (CMO), live Euler-integriert</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Gleichgewicht: y = α·x/(1+(α−1)·x), Sumpf + N Böden + Kopf/Kondensator = {N + 2} dynamische Stufen</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Trägheit durch Flüssigkeits-Holdup je Boden — Änderungen an R, D oder Feed brauchen Zeit, um durch die ganze Kolonne zu wandern</span>
        </div>
      </div>
    </div>
  );
}