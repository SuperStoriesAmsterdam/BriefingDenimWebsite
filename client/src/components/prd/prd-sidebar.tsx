import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EditableText } from "./editable-text";
import { FileText, LayoutDashboard, Map, Plus, ArrowUp, RotateCcw } from "lucide-react";
import type { ViewMode } from "@/types/prd";
import type { PrdStore } from "@/hooks/use-prd-store";
import { cn } from "@/lib/utils";

interface PrdSidebarProps {
  store: PrdStore;
}

const VIEW_MODES: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "wireframe", label: "Wireframes", icon: FileText },
  { id: "ghl", label: "GHL Overview", icon: LayoutDashboard },
  { id: "sitemap", label: "Sitemap", icon: Map },
];

export function PrdSidebar({ store }: PrdSidebarProps) {
  const {
    viewMode,
    setViewMode,
    activePage,
    setActivePage,
    topLevelPages,
    childrenOf,
    renamePage,
    unnestPage,
    nestPage,
    addPage,
    toggleNav,
    currentPage,
    saveStatus,
    overPage,
    setOverPage,
    setDragPage,
    resetToDefaults,
    moveBlockToPage,
    pages,
  } = store;

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-sidebar-primary">
          Denim City
        </div>
        <div className="text-[15px] font-bold text-sidebar-foreground">Wireframe PRD</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-sidebar-foreground/50">v2.0</span>
          {saveStatus && (
            <span
              className={cn(
                "text-[9px]",
                saveStatus === "Saved" ? "text-green-400" : "text-sidebar-primary"
              )}
            >
              {saveStatus}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* View mode switcher */}
        <SidebarGroup>
          <SidebarMenu>
            {VIEW_MODES.map((v) => (
              <SidebarMenuItem key={v.id}>
                <SidebarMenuButton
                  isActive={viewMode === v.id}
                  onClick={() => setViewMode(v.id)}
                  className="text-xs font-semibold"
                >
                  <v.icon className="h-4 w-4" />
                  <span>{v.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Page tree (wireframe mode only) */}
        {viewMode === "wireframe" && (
          <SidebarGroup>
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarGroupAction title="Add page" onClick={addPage}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
            <SidebarMenu>
              {topLevelPages.map((p) => {
                const children = childrenOf(p.id);
                const isActive =
                  activePage === p.id || children.some((c) => c.id === activePage);

                return (
                  <SidebarMenuItem
                    key={p.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("page-id", p.id);
                      setDragPage(p.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOverPage(p.id);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const srcPageId = e.dataTransfer.getData("page-id");
                      const blockPageId = e.dataTransfer.getData("block-page-id");
                      const blockIndex = e.dataTransfer.getData("block-index");

                      if (blockPageId && blockIndex !== "") {
                        // Cross-page block move
                        moveBlockToPage(blockPageId, parseInt(blockIndex, 10), p.id);
                      } else if (srcPageId && srcPageId !== p.id) {
                        // Page nesting
                        nestPage(srcPageId, p.id);
                      }
                      setOverPage(null);
                      setDragPage(null);
                    }}
                    onDragEnd={() => {
                      setDragPage(null);
                      setOverPage(null);
                    }}
                    className={cn(
                      overPage === p.id &&
                        "bg-sidebar-primary/15 outline outline-1 outline-sidebar-primary"
                    )}
                  >
                    <SidebarMenuButton
                      isActive={activePage === p.id}
                      onClick={() => setActivePage(p.id)}
                      className="text-[13px]"
                    >
                      <span className="flex-1 truncate">
                        <EditableText
                          value={p.label}
                          onChange={(v) => renamePage(p.id, v)}
                          className="text-[13px] font-inherit"
                        />
                      </span>
                    </SidebarMenuButton>
                    {!p.nav && (
                      <SidebarMenuBadge>
                        <span className="rounded bg-sidebar-foreground/10 px-1 py-0.5 text-[8px] text-sidebar-foreground/40">
                          footer
                        </span>
                      </SidebarMenuBadge>
                    )}

                    {/* Nested children */}
                    {children.length > 0 && (
                      <SidebarMenuSub>
                        {children.map((ch) => (
                          <SidebarMenuSubItem key={ch.id}>
                            <SidebarMenuSubButton
                              isActive={activePage === ch.id}
                              onClick={() => setActivePage(ch.id)}
                              className="text-xs"
                            >
                              <span className="flex-1 truncate">
                                <EditableText
                                  value={ch.label}
                                  onChange={(v) => renamePage(ch.id, v)}
                                  className="text-xs"
                                />
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  unnestPage(ch.id);
                                }}
                                className="ml-1 shrink-0 text-[10px] text-sidebar-foreground/25 hover:text-sidebar-foreground/60"
                                title="Move to top level"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        {currentPage && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-[10px] text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={() => toggleNav(currentPage.id)}
          >
            {currentPage.nav ? "Move to footer only" : "Move to main nav"}
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-[10px] text-sidebar-foreground/30 hover:text-sidebar-foreground"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Reset to defaults
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all changes?</AlertDialogTitle>
              <AlertDialogDescription>
                This will discard all your edits and restore the original 13 pages. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetToDefaults}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
