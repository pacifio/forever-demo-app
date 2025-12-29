"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Search,
  Sparkles,
  X,
  ExternalLink,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  nodeTypeComponents,
  type CustomNodeType,
} from "@/components/custom-nodes";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import "reactflow/dist/style.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LinkPreview } from "@/components/ui/link-preview";

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
  onPreview?: (url: string, title: string) => void;
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
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <div
      className={cn(
        "min-w-[320px] max-w-[400px] rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-3xl backdrop-saturate-150 transition-all cursor-pointer relative focus:ring-0",
        selected
          ? "ring-2 ring-white/30 border-white/20"
          : "hover:border-white/20"
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "white", width: 8, height: 8, opacity: 0.5 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "white", width: 8, height: 8, opacity: 0.5 }}
      />

      <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <Search className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {data.query}
          </div>
          <div className="text-xs text-white/50">Depth {data.depth}</div>
        </div>
        {data.loading && (
          <Loader2 className="h-4 w-4 animate-spin text-white/70 flex-shrink-0" />
        )}
      </div>

      {data.summary && (
        <div className="relative border-b border-white/10">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => setIsSummaryOpen(value === "summary")}
          >
            <AccordionItem value="summary" className="border-0">
              {!isSummaryOpen && (
                <div className="px-4 py-3">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Simplified components for preview
                      h1: ({ node, ...props }) => (
                        <span className="font-bold text-white" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <span className="font-semibold text-white" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <span className="font-semibold text-white" {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <span className="font-medium text-white" {...props} />
                      ),
                      h5: ({ node, ...props }) => (
                        <span className="font-medium text-white" {...props} />
                      ),
                      h6: ({ node, ...props }) => (
                        <span
                          className="font-medium text-white/90"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <span
                          className="text-white/80 line-clamp-3"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-semibold text-white"
                          {...props}
                        />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic text-white/90" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <span className="text-blue-400" {...props} />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="text-xs text-blue-300 bg-white/10 px-1 py-0.5 rounded font-mono"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => <span {...props} />,
                      ol: ({ node, ...props }) => <span {...props} />,
                      li: ({ node, ...props }) => <span {...props} />,
                      blockquote: ({ node, ...props }) => (
                        <span className="italic text-white/70" {...props} />
                      ),
                      pre: ({ node, ...props }) => <span {...props} />,
                      table: ({ node, ...props }) => <span {...props} />,
                      thead: ({ node, ...props }) => <span {...props} />,
                      tbody: ({ node, ...props }) => <span {...props} />,
                      tr: ({ node, ...props }) => <span {...props} />,
                      th: ({ node, ...props }) => <span {...props} />,
                      td: ({ node, ...props }) => <span {...props} />,
                      hr: () => null,
                    }}
                  >
                    {data.summary}
                  </ReactMarkdown>
                </div>
              )}
              <AccordionTrigger className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white hover:no-underline border-t border-white/5">
                {isSummaryOpen ? "Show less" : "Read more"}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Headings
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-lg font-bold text-white mb-2 mt-4 first:mt-0"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-base font-semibold text-white mb-2 mt-3 first:mt-0"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-sm font-semibold text-white mb-1.5 mt-2 first:mt-0"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="text-sm font-medium text-white mb-1.5 mt-2 first:mt-0"
                        {...props}
                      />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5
                        className="text-xs font-medium text-white mb-1 mt-2 first:mt-0"
                        {...props}
                      />
                    ),
                    h6: ({ node, ...props }) => (
                      <h6
                        className="text-xs font-medium text-white/90 mb-1 mt-2 first:mt-0"
                        {...props}
                      />
                    ),

                    // Paragraphs and text
                    p: ({ node, ...props }) => (
                      <p
                        className="text-sm text-white/80 leading-relaxed mb-3 last:mb-0"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-white" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-white/90" {...props} />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),

                    // Lists
                    ul: ({ node, ...props }) => (
                      <ul
                        className="text-sm text-white/80 space-y-1 mb-3 ml-4 list-disc marker:text-white/50"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="text-sm text-white/80 space-y-1 mb-3 ml-4 list-decimal marker:text-white/50"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        className="text-white/80 leading-relaxed"
                        {...props}
                      />
                    ),

                    // Code
                    code: ({ node, ...props }) => (
                      <code
                        className="block text-xs text-blue-300 bg-white/5 p-3 rounded-lg border border-white/10 font-mono overflow-x-auto"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre className="mb-3 last:mb-0" {...props} />
                    ),

                    // Blockquotes
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-2 border-white/30 pl-3 py-1 my-3 text-white/70 italic"
                        {...props}
                      />
                    ),

                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                      <hr className="border-white/10 my-4" {...props} />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto mb-3">
                        <table
                          className="w-full text-sm border-collapse"
                          {...props}
                        />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="border-b border-white/20" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="divide-y divide-white/10" {...props} />
                    ),
                    tr: ({ node, ...props }) => <tr {...props} />,
                    th: ({ node, ...props }) => (
                      <th
                        className="px-3 py-2 text-left text-white font-semibold"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-3 py-2 text-white/80" {...props} />
                    ),
                  }}
                >
                  {data.summary}
                </ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {data.expansions && data.expansions.length > 0 && !data.loading && (
        <div className="relative">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="expansions" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-xs font-medium text-white/70 hover:text-white hover:no-underline">
                <span>{data.expansions.length} next steps available</span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div>
                  {data.expansions.map((expansion) => (
                    <div
                      key={expansion.id}
                      className="group border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10 hover:border-white/20"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-sm font-medium text-white flex-1">
                          {expansion.query}
                        </div>
                        <div className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm whitespace-nowrap">
                          {(expansion.score * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-xs text-white/60 mb-2">
                        {expansion.rationale}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/50">
                        <span className="rounded-full bg-white/5 px-2 py-0.5">
                          {expansion.action.type}
                        </span>
                        {expansion.autoExpand && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-blue-300">
                            Auto-expand
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
  const [webPreviewOpen, setWebPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const autoExpandedRef = useRef(new Set<string>());

  // Auto-play state
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayState, setAutoPlayState] = useState<"playing" | "stopped">(
    "stopped"
  );
  const [autoExpandCount, setAutoExpandCount] = useState(0);

  const handlePreviewClick = useCallback((url: string, title: string) => {
    setSidePanelOpen(false);
    setPreviewUrl(url);
    setPreviewTitle(title);
    setWebPreviewOpen(true);
  }, []);

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
          position: { x: parentNode.position.x + offsetX, y: yPosition },
          data: {
            query: result.title,
            url: result.url,
            sessionId,
            depth: parentNode.data.depth + 1,
            type: nodeType,
            onPreview: handlePreviewClick,
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
        setNodes((nds) => [...nds, ...mediaNodes]);
        setEdges((eds) => [...eds, ...mediaEdges]);
      }
    },
    [sessionId, setNodes, setEdges, handlePreviewClick]
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
        data: { query, loading: true, sessionId, depth, type: "discovery" },
      };

      setNodes((nds) => [...nds, newNode]);

      if (parentId) {
        const newEdge: Edge = {
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "white", strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "white" },
        };
        setEdges((eds) => [...eds, newEdge]);
      }

      const response = await fetch("http://localhost:8081/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          contextChain: [],
          depth,
          settings: { expansionsPerNode: 6, maxAutoDepth: 10 },
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
                      data: { ...node.data, summary: update.chunk },
                    };
                  }

                  if (update.type === "expansions_generated") {
                    return {
                      ...node,
                      data: { ...node.data, expansions: update.expansions },
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
                    return { ...node, data: updatedData };
                  }

                  return node;
                })
              );

              if (update.type === "complete" && parentId) {
                setEdges((eds) =>
                  eds.map((edge) => {
                    if (edge.id === `edge-${parentId}-${nodeId}`) {
                      return { ...edge, animated: false };
                    }
                    return edge;
                  })
                );
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

      // Initial auto-expand: depth 0 → depth 1 (always happens)
      if (
        completedNodeData &&
        depth === 0 &&
        !autoExpandedRef.current.has(nodeId)
      ) {
        const autoExpandOption = (
          completedNodeData as NodeData
        ).expansions?.find((exp) => exp.autoExpand);

        if (autoExpandOption) {
          autoExpandedRef.current.add(nodeId);

          setTimeout(() => {
            const childPosition = { x: position.x + 450, y: position.y };

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

  // Auto-expand function - finds deepest node and expands it
  const autoExpand = useCallback(() => {
    if (!isAutoPlaying || autoPlayState !== "playing") return;
    if (discoverMutation.isPending) return;

    console.log("[AutoExpand] Looking for node to expand...");

    // Get all discovery nodes that are complete
    const discoveryNodes = nodes.filter(
      (n) => n.data.type === "discovery" && !n.data.loading
    );

    if (discoveryNodes.length < 2) {
      console.log("[AutoExpand] Not enough nodes yet");
      return;
    }

    // Find the deepest node
    const deepestNode = discoveryNodes.reduce((deepest, current) => {
      return current.data.depth > deepest.data.depth ? current : deepest;
    });

    console.log(
      "[AutoExpand] Deepest node:",
      deepestNode.id,
      "at depth",
      deepestNode.data.depth
    );

    // Check if this node has auto-expand option
    const autoExpandOption = deepestNode.data.expansions?.find(
      (exp) => exp.autoExpand
    );

    if (!autoExpandOption) {
      console.log("[AutoExpand] No auto-expand option available, stopping");
      setIsAutoPlaying(false);
      setAutoPlayState("stopped");
      return;
    }

    // Check if already expanded
    if (autoExpandedRef.current.has(deepestNode.id)) {
      console.log("[AutoExpand] Node already expanded");
      return;
    }

    autoExpandedRef.current.add(deepestNode.id);

    // Calculate position for new node (using handleExpansionClick logic)
    const existingChildrenAtDepth = nodes.filter(
      (n) =>
        n.data.depth === deepestNode.data.depth + 1 &&
        n.data.type === "discovery"
    ).length;

    const childPosition = {
      x: deepestNode.position.x + 450,
      y: deepestNode.position.y + existingChildrenAtDepth * 220,
    };

    console.log("[AutoExpand] Expanding with query:", autoExpandOption.query);
    setAutoExpandCount((count) => count + 1);

    discoverMutation.mutate({
      query: autoExpandOption.query,
      parentId: deepestNode.id,
      depth: deepestNode.data.depth + 1,
      position: childPosition,
      autoExpanded: true,
    });
  }, [isAutoPlaying, autoPlayState, nodes, discoverMutation, autoExpandedRef]);

  // Effect to trigger auto-expand
  useEffect(() => {
    if (
      isAutoPlaying &&
      autoPlayState === "playing" &&
      !discoverMutation.isPending
    ) {
      const timer = setTimeout(() => {
        autoExpand();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    isAutoPlaying,
    autoPlayState,
    discoverMutation.isPending,
    autoExpand,
    nodes,
  ]);

  const handleToggleAutoPlay = () => {
    if (autoPlayState === "stopped") {
      console.log("[AutoPlay] Starting auto-play");
      setIsAutoPlaying(true);
      setAutoPlayState("playing");
      setAutoExpandCount(0);
    } else {
      console.log("[AutoPlay] Stopping auto-play");
      setIsAutoPlaying(false);
      setAutoPlayState("stopped");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || discoverMutation.isPending) return;

    const position =
      nodes.length === 0
        ? { x: 250, y: 100 }
        : { x: 250, y: nodes.length * 250 };

    // Reset auto-play state on new search
    setIsAutoPlaying(false);
    setAutoPlayState("stopped");
    setAutoExpandCount(0);
    autoExpandedRef.current.clear();

    discoverMutation.mutate({ query: query.trim(), depth: 0, position });
    setQuery("");
  };

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      if (node.data.type === "discovery") {
        setWebPreviewOpen(false);
        setSelectedNode(node);
        setSidePanelOpen(true);
      } else if (node.data.url) {
        handlePreviewClick(node.data.url, node.data.query);
      }
    },
    [handlePreviewClick]
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

  const discoveryNodeCount = nodes.filter(
    (n) => n.data.type === "discovery"
  ).length;

  return (
    <div className="relative h-screen w-full bg-[#080806]">
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
        <Background gap={16} size={0.8} className="bg-[#0D0D0A]" />

        {/* Auto-Expand Control Panel */}
        <Panel position="top-center" className="pointer-events-auto mt-4">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

            <div className="flex items-center gap-2 relative">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="flex flex-col leading-2.5">
                <span className="text-xs font-semibold text-white">
                  {discoveryNodeCount} nodes
                </span>
                {autoExpandCount > 0 && (
                  <span className="text-[10px] text-white/50">
                    +{autoExpandCount} auto expanded
                  </span>
                )}
              </div>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex items-center gap-1.5 relative">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleAutoPlay}
                disabled={discoveryNodeCount < 2}
                className={cn(
                  "h-7 px-3 rounded-full backdrop-blur-sm text-xs font-medium",
                  autoPlayState === "playing"
                    ? "bg-stone-500/20 hover:bg-stone-500/30 text-stone-400"
                    : "bg-white/10 hover:bg-white/20 text-white",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {autoPlayState === "playing" ? (
                  <>
                    <Square className="h-3 w-3 mr-1.5" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1.5" /> Auto-Loop
                  </>
                )}
              </Button>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      <div className="pointer-events-auto absolute bottom-0 left-0 right-0">
        <div className="mx-auto max-w-3xl p-4">
          <div className="relative rounded-[20px] border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/5 to-transparent opacity-50" />

            <form onSubmit={handleSubmit} className="relative flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything to start discovering..."
                className="flex-1 rounded-full border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={discoverMutation.isPending}
              />
              <Button
                type="submit"
                size={"icon"}
                className="rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                disabled={!query.trim() || discoverMutation.isPending}
              >
                {discoverMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search className="" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Discovery Node Details Panel */}
      {sidePanelOpen && selectedNode && (
        <div className="absolute right-0 top-0 h-full w-100 border-l border-white/10 bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl z-10">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

          <div className="flex h-full flex-col relative">
            <ScrollArea className="flex-1 h-screen relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSidePanelOpen(false);
                  setSelectedNode(null);
                }}
                className="absolute top-3 right-3 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white h-7 w-7"
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <div className="p-4 space-y-4 w-100 pt-4">
                {/* Query Section */}
                <div>
                  <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Query
                  </h3>
                  <p className="text-sm text-white/90 leading-snug w-3/4">
                    {selectedNode.data.query}
                  </p>
                </div>

                {/* Summary Section with Markdown */}
                {selectedNode.data.summary && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Summary
                    </h3>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-base font-bold text-white mb-1.5 mt-2 first:mt-0"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-sm font-semibold text-white mb-1.5 mt-2 first:mt-0"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-xs font-semibold text-white mb-1 mt-1.5 first:mt-0"
                            {...props}
                          />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4
                            className="text-xs font-medium text-white mb-1 mt-1.5 first:mt-0"
                            {...props}
                          />
                        ),
                        h5: ({ node, ...props }) => (
                          <h5
                            className="text-xs font-medium text-white mb-1 mt-1.5 first:mt-0"
                            {...props}
                          />
                        ),
                        h6: ({ node, ...props }) => (
                          <h6
                            className="text-xs font-medium text-white/90 mb-1 mt-1.5 first:mt-0"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="text-xs text-white/80 leading-relaxed mb-2 last:mb-0"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-semibold text-white"
                            {...props}
                          />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic text-white/90" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="text-xs text-white/80 space-y-0.5 mb-2 ml-3 list-disc marker:text-white/50"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="text-xs text-white/80 space-y-0.5 mb-2 ml-3 list-decimal marker:text-white/50"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li
                            className="text-white/80 leading-relaxed"
                            {...props}
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="block text-[10px] text-blue-300 bg-white/5 p-2 rounded-lg border border-white/10 font-mono overflow-x-auto"
                            {...props}
                          />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre className="mb-2 last:mb-0" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-2 border-white/30 pl-2 py-0.5 my-2 text-white/70 italic text-xs"
                            {...props}
                          />
                        ),
                        hr: ({ node, ...props }) => (
                          <hr className="border-white/10 my-2" {...props} />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto mb-2">
                            <table
                              className="w-full text-xs border-collapse"
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead
                            className="border-b border-white/20"
                            {...props}
                          />
                        ),
                        tbody: ({ node, ...props }) => (
                          <tbody
                            className="divide-y divide-white/10"
                            {...props}
                          />
                        ),
                        tr: ({ node, ...props }) => <tr {...props} />,
                        th: ({ node, ...props }) => (
                          <th
                            className="px-2 py-1 text-left text-white font-semibold"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-2 py-1 text-white/80" {...props} />
                        ),
                      }}
                    >
                      {selectedNode.data.summary}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Sources Section with LinkPreview */}
                {selectedNode.data.searchResults &&
                  selectedNode.data.searchResults.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                        Sources
                      </h3>
                      <div className="space-y-1.5">
                        {selectedNode.data.searchResults.map((result, i) => (
                          <LinkPreview
                            key={i}
                            url={result.url}
                            className="block p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm group"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 flex-shrink-0">
                                <ExternalLink className="h-3 w-3 text-white/70 group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate mb-0.5">
                                  {result.title}
                                </p>
                                <p className="text-[10px] text-white/60 line-clamp-2 leading-relaxed">
                                  {result.description}
                                </p>
                              </div>
                            </div>
                          </LinkPreview>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Generated Code Section */}
                {selectedNode.data.generatedCode && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Generated Code
                    </h3>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 overflow-x-auto backdrop-blur-sm">
                      <code className="text-[10px] font-mono text-blue-300 block whitespace-pre">
                        {selectedNode.data.generatedCode.code}
                      </code>
                    </div>
                  </div>
                )}

                {/* Next Steps Section */}
                {selectedNode.data.expansions &&
                  selectedNode.data.expansions.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                        Next Steps
                      </h3>
                      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden divide-y divide-white/10">
                        {selectedNode.data.expansions.map((exp, index) => (
                          <button
                            key={exp.id}
                            onClick={() => handleExpansionClick(exp)}
                            className="w-full text-left p-2.5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            disabled={discoverMutation.isPending}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="text-xs font-medium text-white flex-1 group-hover:text-white transition-colors leading-snug">
                                {exp.query}
                              </p>
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm flex-shrink-0">
                                {Math.round(exp.score * 100)}%
                              </span>
                            </div>
                            <p className="text-[10px] text-white/60 leading-relaxed mb-2">
                              {exp.userBenefit}
                            </p>

                            {/* Action type pill */}
                            <div className="flex items-center gap-1.5">
                              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/50">
                                {exp.action.type}
                              </span>
                              {exp.autoExpand && (
                                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] text-blue-300">
                                  Auto-expand
                                </span>
                              )}
                            </div>
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

      {/* Web Preview Panel - 80% width */}
      {webPreviewOpen && (
        <div className="absolute right-0 top-0 h-full w-[60%] border-l border-border bg-background shadow-2xl z-20">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-hidden">
              <WebPreview defaultUrl={previewUrl} className="h-full">
                <WebPreviewNavigation>
                  <WebPreviewUrl />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 rounded-full"
                    onClick={() => setWebPreviewOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </WebPreviewNavigation>
                <WebPreviewBody src={previewUrl} />
              </WebPreview>
            </div>
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
