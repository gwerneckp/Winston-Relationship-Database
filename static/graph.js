async function fetchGraphData() {
  const response = await fetch(`${apiUrl}/graph_data`);
  const data = await response.json();
  const nodes = data.nodes.map((label, id) => ({ id, label }));
  const edges = data.edges.map((edge) => ({
    from: nodes.findIndex((node) => node.label === edge.from),
    to: nodes.findIndex((node) => node.label === edge.to),
    label: edge.label,
    arrows: "from;to",
  }));

  return { nodes, edges };
}

function drawGraph(nodes, edges) {
  const container = document.getElementById("graph-container");
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges),
  };
  const options = {
    nodes: {
      shape: "circle",
      size: 25,
      font: {
        size: 10,
      },
      borderWidth: 2,
      borderWidthSelected: 4,
      scaling: {
        min: 25,
        max: 50,
        label: {
          enabled: false,
        },
      },
    },
    edges: {
      font: {
        size: 10,
        align: "top",
      },
      smooth: {
        enabled: true,
        type: "continuous",
      },
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
        },
        middle: {
          enabled: true,
          scaleFactor: 0.5,
          type: "bar",
        },
      },
    },
    interaction: {
      hover: true,
      selectable: true,
      selectConnectedEdges: false,
    },
    physics: {
      enabled: false,
    },
  };

  const network = new vis.Network(container, data, options);

  network.on("click", (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = network.body.data.nodes.get(nodeId);
      const nodeName = node.label;
      const clickPosition = params.pointer.DOM;

      alert(
        `Node ${nodeName} (ID: ${nodeId}) clicked at ${clickPosition.x}, ${clickPosition.y}`
      );
    } else {
      hideContextMenu();
    }
  });
}

(async function () {
  const graphData = await fetchGraphData();
  drawGraph(graphData.nodes, graphData.edges);
})();

