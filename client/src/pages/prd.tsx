import { Component, type ErrorInfo, type ReactNode, useState, useCallback, useEffect } from "react";
import { usePrdStore } from "@/hooks/use-prd-store";
import { useUserIdentity } from "@/hooks/use-user-identity";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PrdSidebar } from "@/components/prd/prd-sidebar";
import { PrdToolbar } from "@/components/prd/prd-toolbar";
import { WireframeView } from "@/components/prd/wireframe-view";
import { GhlOverview } from "@/components/prd/ghl-overview";
import { SitemapView } from "@/components/prd/sitemap-view";
import { ShoppingList } from "@/components/prd/shopping-list";
import { TeamManager } from "@/components/prd/team-manager";
import { AnnotationTasks } from "@/components/prd/annotation-tasks";
import { getTeamMembers, saveTeamMembers, loadTeamFromServer, saveTeamToServer, type TeamMember } from "@/lib/team-members";
import type { AnnotationReply } from "@/types/prd";
import { cn } from "@/lib/utils";
import { Map, FileText } from "lucide-react";

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
  const user = useUserIdentity();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getTeamMembers);

  // On mount: pull team from server DB (source of truth) and sync local cache
  useEffect(() => {
    loadTeamFromServer().then((serverMembers) => {
      if (serverMembers && serverMembers.length > 0) {
        saveTeamMembers(serverMembers); // update localStorage cache
        setTeamMembers(serverMembers);
      }
    });
  }, []);

  const updateTeam = useCallback((members: TeamMember[]) => {
    saveTeamMembers(members);    // localStorage cache (instant read)
    saveTeamToServer(members);   // server DB (persists across deploys)
    setTeamMembers(members);
  }, []);

  const teamNames = teamMembers.map((m) => m.name);


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
        <PrdSidebar store={store} currentUser={user.name} />
        <SidebarInset className="flex flex-col overflow-hidden">
          {/* ── Persistent top tab strip ── */}
          <div className="flex items-center gap-0 border-b bg-background shrink-0 px-2">
            <button
              onClick={() => store.setViewMode("sitemap")}
              className={cn(
                "flex items-center gap-1.5 px-4 h-10 text-[12px] font-semibold border-b-2 transition-colors",
                store.viewMode === "sitemap"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Map className="h-3.5 w-3.5" />
              Site Architecture
            </button>
            {store.currentPage && (
              <button
                onClick={() => store.setViewMode("wireframe")}
                className={cn(
                  "flex items-center gap-1.5 px-4 h-10 text-[12px] font-semibold border-b-2 transition-colors",
                  store.viewMode === "wireframe"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                {store.currentPage.label}
              </button>
            )}
          </div>

          {/* ── Scrollable content area ── */}
          <div className="flex-1 overflow-y-auto">
            {(store.viewMode === "wireframe" || store.viewMode === "tasks") && (
              <PrdToolbar
                store={store}
                currentUser={user.name}
                allUsers={teamNames}
                onSelectUser={user.setName}
              />
            )}
            {store.viewMode === "wireframe" && (
              <WireframeView store={store} currentUser={user.name} allUsers={teamNames} />
            )}
            {store.viewMode === "ghl" && <GhlOverview />}
            {store.viewMode === "sitemap" && (
              <SitemapView
                topLevelPages={store.topLevelPages}
                childrenOf={store.childrenOf}
                onNavigate={(pageId) => {
                  store.setViewMode("wireframe");
                  store.setActivePage(pageId);
                }}
              />
            )}
            {store.viewMode === "shopping-list" && (
              <ShoppingList
                pages={store.pages}
                currentUser={user.name}
                onNavigate={(pageId) => { store.setViewMode("wireframe"); store.setActivePage(pageId); }}
                onReplyToPageQuestion={(pageId, qId, reply) => store.replyToPageQuestion(pageId, qId, reply)}
              />
            )}
            {store.viewMode === "tasks" && (
              <AnnotationTasks
                pages={store.pages}
                filterTeam={store.filterTeam}
                onToggleDone={store.toggleAnnotationDone}
                onNavigate={(pageId, blockIndex) => {
                  store.setViewMode("wireframe");
                  store.setActivePage(pageId);
                  setTimeout(() => {
                    document.querySelector(`[data-block-index="${blockIndex}"]`)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              />
            )}
            {store.viewMode === "team" && (
              <TeamManager members={teamMembers} onChange={updateTeam} />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
