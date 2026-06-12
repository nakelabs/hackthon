import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

export default function NigeriaMap({ leaderboardData, onStateClick }) {
  const [tooltip, setTooltip] = useState(null);

  const normalizeStateName = (name) => {
    if (!name) return "";
    let n = name.toLowerCase()
      .replace(/\bstate\b/gi, "") // remove " state"
      .replace(/[^a-z]/g, "");    // remove spaces, hyphens
      
    if (n.includes("fct") || n.includes("abuja") || n.includes("federalcapitalterritory")) {
      return "fct";
    }
    if (n === "nasarawa" || n === "nassarawa") {
      return "nasarawa";
    }
    return n;
  };

  // Map leaderboard to a dictionary for fast lookup
  const dataMap = useMemo(() => {
    const map = {};
    leaderboardData.forEach((state) => {
      let searchName = normalizeStateName(state.state);
      
      let pts = 0;
      if (state.score) {
        const cleanScore = state.score.toString().replace(/,/g, '');
        if (cleanScore.toUpperCase().includes('K')) {
          pts = parseFloat(cleanScore.toUpperCase().replace('K', '')) * 1000;
        } else {
          pts = parseFloat(cleanScore);
        }
      }
      
      map[searchName] = { ...state, pts };
    });
    return map;
  }, [leaderboardData]);

  // Find max points to define the domain of the color scale
  const maxPts = useMemo(() => {
    return Math.max(...Object.values(dataMap).map(s => s.pts), 1000);
  }, [dataMap]);

  // Brutalist green color scale
  // We want top ranks to be bright green (#008751) and bottom ranks to be dark (#001a0f)
  const colorScale = scaleLinear()
    .domain([0, maxPts])
    .range(["#001a0f", "#008751"]);

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-[8px_8px_0_rgba(255,255,255,0.1)]">
      
      {/* Tooltip Overlay */}
      {tooltip && (
        <div className="absolute top-4 left-4 bg-black border border-[#008751] p-4 rounded-md shadow-[4px_4px_0_rgba(0,135,81,0.5)] z-10 pointer-events-none">
          <h3 className="font-bold text-white text-lg">{tooltip.name}</h3>
          {tooltip.data ? (
            <>
              <p className="text-sm text-white/80">Rank: #{tooltip.data.rank}</p>
              <p className="text-[#008751] font-bold mt-1">{tooltip.data.pts.toLocaleString()} pts</p>
            </>
          ) : (
            <p className="text-sm text-white/50 italic mt-1">No data available</p>
          )}
        </div>
      )}

      {/* Map Rendering */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 3500, center: [8.5, 9] }} // Centered and zoomed in on Nigeria
        width={800}
        height={800}
        className="w-full h-full outline-none"
      >
        <ZoomableGroup center={[8, 9]} zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography="/nigeria-states.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name || "";
                let lookupName = normalizeStateName(geoName);
                
                const stateData = dataMap[lookupName];
                const fillColor = stateData ? colorScale(stateData.pts) : "#111111";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setTooltip({ name: geoName, data: stateData })}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (stateData && onStateClick) {
                        onStateClick(stateData);
                      }
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: "rgba(255,255,255,0.2)",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 250ms",
                      },
                      hover: {
                        fill: "#fff",
                        stroke: "#008751",
                        strokeWidth: 2,
                        outline: "none",
                        cursor: "pointer",
                        transform: "translate(-2px, -2px)",
                        filter: "drop-shadow(4px 4px 0px rgba(0,135,81,0.8))",
                        zIndex: 10,
                      },
                      pressed: {
                        fill: "#008751",
                        stroke: "#fff",
                        strokeWidth: 1,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
