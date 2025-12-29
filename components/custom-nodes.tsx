import {
  FileText,
  Play,
  Code,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Users,
  ShoppingCart,
  Wrench,
  Globe,
  MessageSquare,
  BarChart,
  Zap,
  GitBranch,
  Package,
} from "lucide-react";
import { Handle, Position } from "reactflow";

export interface BaseNodeData {
  query: string;
  sessionId: string;
  depth: number;
  type: string;
  url?: string;
}

const CustomNodeWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: "#94a3b8", width: 6, height: 6 }}
    />
    {children}
  </div>
);

export const ArticleNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-blue-800 bg-blue-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-blue-800/50">
        <FileText className="h-4 w-4 text-blue-400" />
        <span className="text-xs font-medium text-blue-100">Article</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-blue-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline font-medium"
        >
          Read →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const VideoNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-purple-800 bg-purple-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-800/50">
        <Play className="h-4 w-4 text-purple-400" />
        <span className="text-xs font-medium text-purple-100">Video</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-purple-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-400 hover:underline font-medium"
        >
          Watch →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const TutorialNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-green-800 bg-green-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-green-800/50">
        <BookOpen className="h-4 w-4 text-green-400" />
        <span className="text-xs font-medium text-green-100">Tutorial</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-green-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-400 hover:underline font-medium"
        >
          Learn →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const CodeExampleNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-orange-800 bg-orange-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-orange-800/50">
        <Code className="h-4 w-4 text-orange-400" />
        <span className="text-xs font-medium text-orange-100">
          Code Example
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-orange-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-400 hover:underline font-medium"
        >
          View Code →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const BestPracticeNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-teal-800 bg-teal-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-teal-800/50">
        <Lightbulb className="h-4 w-4 text-teal-400" />
        <span className="text-xs font-medium text-teal-100">Best Practice</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-teal-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-400 hover:underline font-medium"
        >
          Learn More →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const TrendNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-pink-800 bg-pink-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-pink-800/50">
        <TrendingUp className="h-4 w-4 text-pink-400" />
        <span className="text-xs font-medium text-pink-100">Trend</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-pink-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-pink-400 hover:underline font-medium"
        >
          Explore →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const CommunityNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-indigo-800 bg-indigo-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-indigo-800/50">
        <Users className="h-4 w-4 text-indigo-400" />
        <span className="text-xs font-medium text-indigo-100">Community</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-indigo-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-400 hover:underline font-medium"
        >
          Join →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const ToolNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-amber-800 bg-amber-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-amber-800/50">
        <Wrench className="h-4 w-4 text-amber-400" />
        <span className="text-xs font-medium text-amber-100">Tool</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-amber-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-400 hover:underline font-medium"
        >
          Try It →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const ProductNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-emerald-800 bg-emerald-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-emerald-800/50">
        <ShoppingCart className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-100">Product</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-emerald-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:underline font-medium"
        >
          View →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const DocumentationNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-gray-700 bg-gray-900/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/50">
        <Globe className="h-4 w-4 text-gray-300" />
        <span className="text-xs font-medium text-gray-100">Documentation</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-300 hover:underline font-medium"
        >
          Read Docs →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const ForumNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-cyan-800 bg-cyan-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-800/50">
        <MessageSquare className="h-4 w-4 text-cyan-400" />
        <span className="text-xs font-medium text-cyan-100">Forum</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-cyan-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:underline font-medium"
        >
          Discuss →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const ComparisonNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-violet-800 bg-violet-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-violet-800/50">
        <BarChart className="h-4 w-4 text-violet-400" />
        <span className="text-xs font-medium text-violet-100">Comparison</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-violet-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-violet-400 hover:underline font-medium"
        >
          Compare →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const QuickStartNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-lime-800 bg-lime-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-lime-800/50">
        <Zap className="h-4 w-4 text-lime-400" />
        <span className="text-xs font-medium text-lime-100">Quick Start</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-lime-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-lime-400 hover:underline font-medium"
        >
          Get Started →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const GitHubNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-slate-700 bg-slate-900/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50">
        <GitBranch className="h-4 w-4 text-slate-300" />
        <span className="text-xs font-medium text-slate-100">GitHub</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-slate-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-300 hover:underline font-medium"
        >
          View Repo →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export const PackageNode = ({
  data,
}: {
  data: BaseNodeData & { url: string };
}) => (
  <CustomNodeWrapper>
    <div className="w-[240px] rounded-lg border border-red-800 bg-red-950/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-red-800/50">
        <Package className="h-4 w-4 text-red-400" />
        <span className="text-xs font-medium text-red-100">Package</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-red-100 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-red-400 hover:underline font-medium"
        >
          Install →
        </a>
      </div>
    </div>
  </CustomNodeWrapper>
);

export type CustomNodeType =
  | "article"
  | "video"
  | "tutorial"
  | "code"
  | "bestpractice"
  | "trend"
  | "community"
  | "tool"
  | "product"
  | "docs"
  | "forum"
  | "comparison"
  | "quickstart"
  | "github"
  | "package";

export const nodeTypeComponents = {
  article: ArticleNode,
  video: VideoNode,
  tutorial: TutorialNode,
  code: CodeExampleNode,
  bestpractice: BestPracticeNode,
  trend: TrendNode,
  community: CommunityNode,
  tool: ToolNode,
  product: ProductNode,
  docs: DocumentationNode,
  forum: ForumNode,
  comparison: ComparisonNode,
  quickstart: QuickStartNode,
  github: GitHubNode,
  package: PackageNode,
};
