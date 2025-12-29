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
      style={{ background: "#64748b", width: 6, height: 6 }}
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
    <div className="w-[240px] rounded-lg border border-blue-200 bg-blue-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-blue-200/50">
        <FileText className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-medium text-blue-900">Article</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-blue-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-purple-200 bg-purple-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-200/50">
        <Play className="h-4 w-4 text-purple-600" />
        <span className="text-xs font-medium text-purple-900">Video</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-purple-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-green-200 bg-green-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-green-200/50">
        <BookOpen className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium text-green-900">Tutorial</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-green-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-orange-200 bg-orange-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-orange-200/50">
        <Code className="h-4 w-4 text-orange-600" />
        <span className="text-xs font-medium text-orange-900">
          Code Example
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-orange-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-teal-200 bg-teal-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-teal-200/50">
        <Lightbulb className="h-4 w-4 text-teal-600" />
        <span className="text-xs font-medium text-teal-900">Best Practice</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-teal-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-pink-200 bg-pink-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-pink-200/50">
        <TrendingUp className="h-4 w-4 text-pink-600" />
        <span className="text-xs font-medium text-pink-900">Trend</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-pink-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-pink-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-indigo-200 bg-indigo-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-indigo-200/50">
        <Users className="h-4 w-4 text-indigo-600" />
        <span className="text-xs font-medium text-indigo-900">Community</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-indigo-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-amber-200 bg-amber-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-amber-200/50">
        <Wrench className="h-4 w-4 text-amber-600" />
        <span className="text-xs font-medium text-amber-900">Tool</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-amber-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-emerald-200 bg-emerald-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-emerald-200/50">
        <ShoppingCart className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-medium text-emerald-900">Product</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-emerald-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-gray-300 bg-gray-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300/50">
        <Globe className="h-4 w-4 text-gray-700" />
        <span className="text-xs font-medium text-gray-900">Documentation</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-700 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-cyan-200 bg-cyan-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-200/50">
        <MessageSquare className="h-4 w-4 text-cyan-600" />
        <span className="text-xs font-medium text-cyan-900">Forum</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-cyan-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-violet-200 bg-violet-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-violet-200/50">
        <BarChart className="h-4 w-4 text-violet-600" />
        <span className="text-xs font-medium text-violet-900">Comparison</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-violet-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-violet-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-lime-200 bg-lime-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-lime-200/50">
        <Zap className="h-4 w-4 text-lime-600" />
        <span className="text-xs font-medium text-lime-900">Quick Start</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-lime-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-lime-600 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-slate-300 bg-slate-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-300/50">
        <GitBranch className="h-4 w-4 text-slate-700" />
        <span className="text-xs font-medium text-slate-900">GitHub</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-slate-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-700 hover:underline font-medium"
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
    <div className="w-[240px] rounded-lg border border-red-200 bg-red-50/90 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-red-200/50">
        <Package className="h-4 w-4 text-red-600" />
        <span className="text-xs font-medium text-red-900">Package</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-red-900 line-clamp-2 mb-2">
          {data.query}
        </p>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-red-600 hover:underline font-medium"
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
