async function fetchGraphData() {
  const response = await fetch("/graph_data", {
    credentials: "same-origin",
    headers: {
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
  });
  const data = await response.json();
  const nodes = data.nodes.map((label, id) => ({
    id: id,
    label: splitLabel(label, 15),
    data: { name: label },
  }));
  const edges = data.edges.map((edge) => ({
    from: nodes.findIndex((node) => node.data.name === edge.from),
    to: nodes.findIndex((node) => node.data.name === edge.to),
    label: edge.label,
    arrows: "from;to",
  }));

  return { nodes, edges };
}
function splitLabel(label, maxLen = 20) {
  let result = "";
  let splitLabel = label.replace("-", " ").split(" ");
  let thisLineCount = 0;
  for (let i = 0; i < splitLabel.length; i++) {
    let split = splitLabel[i];
    if (thisLineCount + split.length > maxLen) {
      result += "\n";
      thisLineCount = 0;
    }
    result += split + " ";
    thisLineCount += split.length + 1;
  }
  return result.trim();
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
        customScalingFunction: (min, max, total, value) => {
          return value / total;
        },
        min: 25,
        max: 50,
        label: {
          enabled: true,
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
      enabled: true,
      barnesHut: {
        // gravitationalConstant: -2000,
        // centralGravity: 0.1,
        // springLength: 100,
        // springConstant: 0.04,
        // damping: 0.09,
        avoidOverlap: 0.1,
      },
      // maxVelocity: 50,
      // minVelocity: 0.1,
      solver: "barnesHut",
      // timestep: 0.5,
    },
  };

  const network = new vis.Network(container, data, options);

  network.on("click", async (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const nodeName = network.body.data.nodes.get(nodeId).data.name;
      getResultsDisplayed(nodeName, "context-menu");
    }
  });
}

async function fetchAndDraw() {
  const graphData = await fetchGraphData();
  drawGraph(graphData.nodes, graphData.edges);
}

fetchAndDraw();
