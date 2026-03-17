import { Component, type ErrorInfo, type ReactNode } from "react";
import { usePrdStore } from "@/hooks/use-prd-store";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PrdSidebar } from "@/components/prd/prd-sidebar";
import { PrdToolbar } from "@/components/prd/prd-toolbar";
import { WireframeView } from "@/components/prd/wireframe-view";
import { GhlOverview } from "@/components/prd/ghl-overview";
import { SitemapView } from "@/components/prd/sitemap-view";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("PRD Error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-red-600">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{this.state.error.message}</pre>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-500">{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PrdPage() {
  const store = usePrdStore();

  if (!store.pages) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <PrdSidebar store={store} />
        <SidebarInset className="overflow-y-auto">
          {store.viewMode === "wireframe" && <PrdToolbar store={store} />}
          {store.viewMode === "wireframe" && <WireframeView store={store} />}
          {store.viewMode === "ghl" && <GhlOverview />}
          {store.viewMode === "sitemap" && (
            <SitemapView
              topLevelPages={store.topLevelPages}
              childrenOf={store.childrenOf}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
