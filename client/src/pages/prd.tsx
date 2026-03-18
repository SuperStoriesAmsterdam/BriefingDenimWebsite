import { Component, type ErrorInfo, type ReactNode, useState, useCallback } from "react";
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
import { getTeamMembers, saveTeamMembers, getTeamNames, type TeamMember } from "@/lib/team-members";
import type { AnnotationReply } from "@/types/prd";

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

  const updateTeam = useCallback((members: TeamMember[]) => {
    saveTeamMembers(members);
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
        <SidebarInset className="overflow-y-auto">
          {store.viewMode === "wireframe" && (
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
          {store.viewMode === "team" && (
            <TeamManager members={teamMembers} onChange={updateTeam} />
          )}
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
