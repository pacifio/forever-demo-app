"use client";

import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Search, Sparkles, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  nodeTypeComponents,
  type CustomNodeType,
} from "@/components/custom-nodes";
import "reactflow/dist/style.css";

interface ExpansionOption {
  id: string;
  query: string;
  action: {
    type: string;
    query?: string;
    framework?: string;
    task?: string;
  };
  score: number;
  rationale: string;
  autoExpand: boolean;
  userBenefit: string;
}

interface NodeData {
  query: string;
  summary?: string;
  searchResults?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  generatedCode?: {
    code: string;
    language: string;
    explanation: string;
  };
  expansions?: ExpansionOption[];
  loading?: boolean;
  sessionId: string;
  depth: number;
  type: "discovery" | CustomNodeType;
  url?: string;
}

interface DiscoveryUpdate {
  type:
    | "progress"
    | "summary_chunk"
    | "expansions_generated"
    | "complete"
    | "error";
  message?: string;
  stage?: string;
  chunk?: string;
  expansions?: ExpansionOption[];
  result?: any;
  error?: string;
}

const DiscoveryNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected: boolean;
}) => {
  return (
    <div
      className={cn(
        "min-w-[280px] max-w-[320px] rounded-xl border bg-background shadow-lg transition-all cursor-pointer",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      )}
    >
      {/* Input handle (left side) for incoming connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#64748b", width: 8, height: 8 }}
      />

      {/* Output handle (right side) for outgoing connections */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#64748b", width: 8, height: 8 }}
      />

      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {data.query}
          </div>
          <div className="text-xs text-muted-foreground">
            Depth {data.depth}
          </div>
        </div>
        {data.loading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />
        )}
      </div>

      {data.summary && (
        <div className="px-4 py-3">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {data.summary}
          </p>
        </div>
      )}

      {data.expansions && data.expansions.length > 0 && !data.loading && (
        <div className="border-t border-border px-4 py-2">
          <div className="text-xs font-medium text-muted-foreground">
            {data.expansions.length} next steps available
          </div>
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  discovery: DiscoveryNode,
  ...nodeTypeComponents,
};

const NODE_TYPE_MAPPING: Record<string, CustomNodeType[]> = {
  "github.com": ["github"],
  "npmjs.com": ["package"],
  "youtube.com": ["video"],
  "youtu.be": ["video"],
  "stackoverflow.com": ["forum"],
  "reddit.com": ["community"],
  "docs.": ["docs"],
  tutorial: ["tutorial"],
  guide: ["tutorial"],
  quickstart: ["quickstart"],
  "getting started": ["quickstart"],
  vs: ["comparison"],
  compare: ["comparison"],
  "best practices": ["bestpractice"],
  example: ["code"],
  trends: ["trend"],
  product: ["product"],
  tool: ["tool"],
};

function determineNodeType(url: string, title: string): CustomNodeType {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();

  for (const [keyword, types] of Object.entries(NODE_TYPE_MAPPING)) {
    if (urlLower.includes(keyword) || titleLower.includes(keyword)) {
      return types[0];
    }
  }

  return "article";
}

function DiscoveryCanvas() {
  const reactFlow = useReactFlow();
  const sessionId = useRef(`session-${Date.now()}`).current;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [query, setQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const autoExpandedRef = useRef(new Set<string>());

  console.log("[ReactFlow State] Current state:", {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodeIds: nodes.map((n) => n.id),
    edgeIds: edges.map((e) => `${e.source}->${e.target}`),
  });

  const createMediaNodes = useCallback(
    (parentNode: Node<NodeData>, parentId: string) => {
      if (parentNode.data.depth < 2 || parentNode.data.depth > 5) return;
      if (
        !parentNode.data.searchResults ||
        parentNode.data.searchResults.length === 0
      )
        return;

      const mediaNodes: Node<NodeData>[] = [];
      const mediaEdges: Edge[] = [];

      const baseY = parentNode.position.y;
      const offsetX = 380;

      const topResults = parentNode.data.searchResults.slice(0, 2);

      topResults.forEach((result, index) => {
        const nodeType = determineNodeType(result.url, result.title);

        const yPosition = baseY + (index === 0 ? -80 : 80);

        const mediaNode: Node<NodeData> = {
          id: `${nodeType}-${parentId}-${index}`,
          type: nodeType,
          position: {
            x: parentNode.position.x + offsetX,
            y: yPosition,
          },
          data: {
            query: result.title,
            url: result.url,
            sessionId,
            depth: parentNode.data.depth + 1,
            type: nodeType,
          },
        };

        mediaNodes.push(mediaNode);

        const edgeColor = getEdgeColorForType(nodeType);
        const mediaEdge: Edge = {
          id: `edge-${parentId}-${mediaNode.id}`,
          source: parentId,
          target: mediaNode.id,
          type: "smoothstep",
          animated: false,
          style: {
            stroke: edgeColor,
            strokeWidth: 1.5,
            strokeDasharray: "5,5",
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
        };

        mediaEdges.push(mediaEdge);
      });

      if (mediaNodes.length > 0) {
        setNodes((nds) => {
          return [...nds, ...mediaNodes];
        });
        setEdges((eds) => {
          return [...eds, ...mediaEdges];
        });
      }
    },
    [sessionId, setNodes, setEdges]
  );

  const getEdgeColorForType = (type: string): string => {
    const colors: Record<string, string> = {
      article: "#3b82f6",
      video: "#9333ea",
      tutorial: "#10b981",
      code: "#f97316",
      bestpractice: "#14b8a6",
      trend: "#ec4899",
      community: "#6366f1",
      tool: "#f59e0b",
      product: "#059669",
      docs: "#64748b",
      forum: "#06b6d4",
      comparison: "#8b5cf6",
      quickstart: "#84cc16",
      github: "#374151",
      package: "#dc2626",
    };
    return colors[type] || "#64748b";
  };

  const discoverMutation = useMutation({
    mutationFn: async ({
      query,
      parentId,
      depth,
      position,
      autoExpanded = false,
    }: {
      query: string;
      parentId?: string;
      depth: number;
      position: { x: number; y: number };
      autoExpanded?: boolean;
    }) => {
      const nodeId = `node-${Date.now()}-${Math.random()}`;

      const newNode: Node<NodeData> = {
        id: nodeId,
        type: "discovery",
        position,
        data: {
          query,
          loading: true,
          sessionId,
          depth,
          type: "discovery",
        },
      };

      setNodes((nds) => {
        return [...nds, newNode];
      });

      if (parentId) {
        const newEdge: Edge = {
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#64748b", strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        };

        setEdges((eds) => {
          const newEdges = [...eds, newEdge];
          return newEdges;
        });
      }

      const response = await fetch("http://localhost:8081/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          contextChain: [],
          depth,
          settings: {
            expansionsPerNode: 6,
            maxAutoDepth: 10,
          },
          userId: "user-1",
          sessionId,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      let completedNodeData: NodeData | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const update: DiscoveryUpdate = JSON.parse(data);

              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id !== nodeId) return node;

                  if (update.type === "summary_chunk") {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        summary: update.chunk,
                      },
                    };
                  }

                  if (update.type === "expansions_generated") {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        expansions: update.expansions,
                      },
                    };
                  }

                  if (update.type === "complete") {
                    const updatedData = {
                      ...node.data,
                      summary: update.result.content.summary,
                      searchResults: update.result.content.searchResults,
                      generatedCode: update.result.content.generatedCode,
                      expansions: update.result.expansions,
                      loading: false,
                    };
                    completedNodeData = updatedData;
                    return {
                      ...node,
                      data: updatedData,
                    };
                  }

                  return node;
                })
              );

              if (update.type === "complete" && parentId) {
                setEdges((eds) => {
                  const updatedEdges = eds.map((edge) => {
                    if (edge.id === `edge-${parentId}-${nodeId}`) {
                      return {
                        ...edge,
                        animated: false,
                      };
                    }
                    return edge;
                  });
                  return updatedEdges;
                });
              }
            } catch (e) {}
          }
        }
      }

      setTimeout(() => {
        reactFlow.fitView({ padding: 0.2, duration: 500 });
      }, 100);

      if (completedNodeData && !autoExpanded) {
        const fakeNode: Node<NodeData> = {
          id: nodeId,
          type: "discovery",
          position,
          data: completedNodeData,
        };
        createMediaNodes(fakeNode, nodeId);
      }

      if (
        completedNodeData &&
        depth === 0 &&
        !autoExpandedRef.current.has(nodeId)
      ) {
        const autoExpandOption = completedNodeData.expansions?.find(
          (exp) => exp.autoExpand
        );

        if (autoExpandOption) {
          autoExpandedRef.current.add(nodeId);

          setTimeout(() => {
            const childPosition = {
              x: position.x + 450,
              y: position.y,
            };

            discoverMutation.mutate({
              query: autoExpandOption.query,
              parentId: nodeId,
              depth: depth + 1,
              position: childPosition,
              autoExpanded: true,
            });
          }, 500);
        }
      }

      return nodeId;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || discoverMutation.isPending) return;

    const position =
      nodes.length === 0
        ? { x: 250, y: 100 }
        : { x: 250, y: nodes.length * 250 };

    discoverMutation.mutate({
      query: query.trim(),
      depth: 0,
      position,
    });

    setQuery("");
  };

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      if (node.data.type !== "discovery") return;
      setSelectedNode(node);
      setSidePanelOpen(true);
    },
    []
  );

  const handleExpansionClick = (expansion: ExpansionOption) => {
    if (!selectedNode) return;

    const existingChildrenAtDepth = nodes.filter(
      (n) =>
        n.data.depth === selectedNode.data.depth + 1 &&
        n.data.type === "discovery"
    ).length;

    const childPosition = {
      x: selectedNode.position.x + 450,
      y: selectedNode.position.y + existingChildrenAtDepth * 220,
    };

    discoverMutation.mutate({
      query: expansion.query,
      parentId: selectedNode.id,
      depth: selectedNode.data.depth + 1,
      position: childPosition,
    });

    setSidePanelOpen(false);
  };

  return (
    <div className="relative h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} className="bg-muted/30" />
        <Controls className="rounded-lg border border-border bg-background shadow-lg" />
        <MiniMap
          className="rounded-lg border border-border bg-background shadow-lg"
          nodeColor={(node) => {
            if (node.data?.loading) return "#f59e0b";
            return getEdgeColorForType(node.type || "discovery");
          }}
        />

        <Panel position="top-center" className="pointer-events-none mt-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-lg">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Discovery Canvas</span>
            <span className="text-xs text-muted-foreground">
              {nodes.length} {nodes.length === 1 ? "node" : "nodes"}
            </span>
          </div>
        </Panel>
      </ReactFlow>

      <div className="pointer-events-auto absolute bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-3xl p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything to start discovering..."
              className="flex-1"
              disabled={discoverMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!query.trim() || discoverMutation.isPending}
            >
              {discoverMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Discovering
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Discover
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {sidePanelOpen && selectedNode && (
        <div className="absolute right-0 top-0 h-full w-[400px] border-l border-border bg-background shadow-2xl">
          <div className="flex h-full flex-col">
            {/* <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Node Details</h2>
                <p className="text-xs text-muted-foreground">
                  Depth {selectedNode.data.depth}
                </p>
              </div>
              
            </div> */}

            <ScrollArea className="flex-1 h-screen relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidePanelOpen(false)}
                className="absolute top-2 right-4 z-10 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="p-4 space-y-4">
                <div className="mt-2">
                  <h3 className="text-lg font-medium mb-2">Query</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedNode.data.query}
                  </p>
                </div>

                {selectedNode.data.summary && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Summary</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedNode.data.summary}
                    </p>
                  </div>
                )}

                {selectedNode.data.searchResults &&
                  selectedNode.data.searchResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Sources</h3>
                      <div className="space-y-2">
                        {selectedNode.data.searchResults.map((result, i) => (
                          <a
                            key={i}
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded-md border border-border hover:bg-muted transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {result.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {result.description}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedNode.data.generatedCode && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Generated Code</h3>
                    <div className="rounded-md bg-muted p-3 overflow-x-auto">
                      <code className="text-xs font-mono">
                        {selectedNode.data.generatedCode.code}
                      </code>
                    </div>
                  </div>
                )}

                {selectedNode.data.expansions &&
                  selectedNode.data.expansions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Next Steps</h3>
                      <div className="space-y-2">
                        {selectedNode.data.expansions.map((exp) => (
                          <button
                            key={exp.id}
                            onClick={() => handleExpansionClick(exp)}
                            className="w-full text-left p-3 rounded-md border border-border hover:bg-muted transition-colors"
                            disabled={discoverMutation.isPending}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium flex-1">
                                {exp.query}
                              </p>
                              <span className="text-xs font-semibold text-primary flex-shrink-0">
                                {Math.round(exp.score * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {exp.userBenefit}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <ReactFlowProvider>
      <DiscoveryCanvas />
    </ReactFlowProvider>
  );
}
