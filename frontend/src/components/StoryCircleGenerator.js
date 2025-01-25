import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  alpha,
} from "@mui/material";
import axios from "axios";
import * as d3 from "d3";

const DNA_COLORS = ["#6C5B7B", "#C06C84", "#F67280", "#F8B195"];
const HELIX_RADIUS = 120;
const NODE_RADIUS = 8;

export default function StoryCircleGenerator() {
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [strands, setStrands] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const svgRef = useRef(null);

  const generateStoryDNA = async () => {
    if (!theme.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8001/api/generate-story-circle",
        {
          theme: theme.trim(),
          strands: 4,
        },
        {
          timeout: 30000, // 30-second timeout
        }
      );

      setStrands(data.map((strand) => strand.phases));
    } catch (error) {
      console.error("Full error details:", error);

      let errorMessage = "Failed to generate story DNA";
      if (error.response) {
        errorMessage = error.response.data.detail || errorMessage;
        console.error("Server response:", error.response.data);

        // Show detailed error for development
        alert(`Error: ${errorMessage}\n\nCheck console for details`);
      } else if (error.request) {
        errorMessage = "No response from server";
      }

      setStrands([]);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderDNA = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.parentElement.offsetWidth;
    const height = 600;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    strands.forEach((strand, i) => {
      const helix = d3
        .line()
        .curve(d3.curveNatural)
        .x((d) => d.x)
        .y((d) => d.y);

      const points = Array.from({ length: 12 }, (_, j) => ({
        x: width / 2 + HELIX_RADIUS * Math.sin((j * Math.PI) / 2),
        y: (height * (j + 1)) / 14 + (i % 2 ? HELIX_RADIUS : -HELIX_RADIUS),
      }));

      svg
        .append("path")
        .datum(points)
        .attr("d", helix)
        .attr("fill", "none")
        .attr("stroke", alpha(DNA_COLORS[i % 4], 0.1))
        .attr("stroke-width", 2);

      points.forEach((point, j) => {
        const node = svg
          .append("g")
          .attr("transform", `translate(${point.x},${point.y})`)
          .datum({ strand: i, phase: j })
          .on("click", handleNodeClick);

        node
          .append("circle")
          .attr("r", NODE_RADIUS)
          .attr("fill", DNA_COLORS[i % 4])
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        node
          .on("mouseover", () => {
            node
              .select("circle")
              .transition()
              .attr("r", NODE_RADIUS * 1.5)
              .attr("fill", alpha(DNA_COLORS[i % 4], 0.8));
          })
          .on("mouseout", () => {
            node
              .select("circle")
              .transition()
              .attr("r", NODE_RADIUS)
              .attr("fill", DNA_COLORS[i % 4]);
          });
      });
    });
  }, [strands]);

  useEffect(() => {
    if (strands.length > 0) renderDNA();
  }, [strands, renderDNA]);

  const handleNodeClick = (event, { strand, phase }) => {
    setSelectedNodes((prev) => {
      const exists = prev.some((n) => n.strand === strand && n.phase === phase);
      return exists
        ? prev.filter((n) => !(n.strand === strand && n.phase === phase))
        : [...prev, { strand, phase }];
    });
  };

  const performCrossover = () => {
    if (selectedNodes.length !== 2) return;

    const [a, b] = selectedNodes;
    setStrands((strands) => {
      const newStrands = [...strands];
      const temp = newStrands[a.strand][a.phase];
      newStrands[a.strand][a.phase] = newStrands[b.strand][b.phase];
      newStrands[b.strand][b.phase] = temp;
      return newStrands;
    });
    setSelectedNodes([]);
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        p: 4,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h1"
          sx={{ fontWeight: 800, letterSpacing: "-0.05em", mb: 1 }}
        >
          Story DNA
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
        >
          Evolve stories through genetic recombination
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 8, "& > *": { flex: 1 } }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Enter story seed..."
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: 24, fontWeight: 500, textAlign: "center" },
          }}
        />
        <Button
          variant="contained"
          onClick={generateStoryDNA}
          disabled={loading}
          sx={{ height: 56, width: 200, borderRadius: 28, fontWeight: 700 }}
        >
          {loading ? <CircularProgress size={24} /> : "Generate"}
        </Button>
      </Box>

      {/* DNA Visualization */}
      <Box
        sx={{
          position: "relative",
          height: 600,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />

        {/* Crossover Controls */}
        {selectedNodes.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={performCrossover}
              sx={{ borderRadius: 24, px: 4, bgcolor: "success.light" }}
            >
              Crossbreed Selected
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedNodes([])}
              sx={{
                borderRadius: 24,
                borderColor: "divider",
                color: "text.secondary",
              }}
            >
              Clear
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
