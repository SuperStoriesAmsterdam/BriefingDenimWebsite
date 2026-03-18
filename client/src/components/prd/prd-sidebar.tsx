import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
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
import { StorageIndicator } from "./storage-indicator";
import { LayoutDashboard, Map, Plus, ArrowUp, RotateCcw, ChevronRight, Trash2, HelpCircle, Route, ClipboardList, Users } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ViewMode } from "@/types/prd";
import type { PrdStore } from "@/hooks/use-prd-store";
import { cn } from "@/lib/utils";

interface PrdSidebarProps {
  store: PrdStore;
  currentUser: string | null;
}

const VIEW_MODES: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "ghl", label: "GHL Overview", icon: LayoutDashboard },
  { id: "sitemap", label: "Sitemap", icon: Map },
  { id: "shopping-list", label: "My List", icon: ClipboardList },
  { id: "team", label: "Team Members", icon: Users },
];

type DropZone = { pageId: string; position: "before" | "after" } | null;

export function PrdSidebar({ store, currentUser }: PrdSidebarProps) {
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
    deletePage,
    toggleNav,
    currentPage,
    saveStatus,
    overPage,
    setOverPage,
    setDragPage,
    dragPage,
    resetToDefaults,
    moveBlockToPage,
    reorderPage,
    pages,
  } = store;

  const [dropZone, setDropZone] = useState<DropZone>(null);
  const [briefingsOpen, setBriefingsOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(true);

  const handleDragOver = (e: React.DragEvent, pageId: string) => {
    e.preventDefault();

    // If this is a block drag, just highlight the page
    if (e.dataTransfer.types.includes("block-page-id")) {
      setOverPage(pageId);
      setDropZone(null);
      return;
    }

    // For page drags, detect top/bottom half
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? "before" : "after";
    setDropZone({ pageId, position });
    setOverPage(null);
  };

  const handleDrop = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    const srcPageId = e.dataTransfer.getData("page-id");
    const blockPageId = e.dataTransfer.getData("block-page-id");
    const blockIndex = e.dataTransfer.getData("block-index");

    if (blockPageId && blockIndex !== "") {
      // Cross-page block move
      moveBlockToPage(blockPageId, parseInt(blockIndex, 10), targetPageId);
    } else if (srcPageId && srcPageId !== targetPageId) {
      if (dropZone) {
        // Reorder
        reorderPage(srcPageId, targetPageId, dropZone.position);
      } else {
        // Nest (fallback)
        nestPage(srcPageId, targetPageId);
      }
    }
    setOverPage(null);
    setDragPage(null);
    setDropZone(null);
  };

  const handleDragEnd = () => {
    setDragPage(null);
    setOverPage(null);
    setDropZone(null);
  };

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-sidebar-primary">
          Denim City
        </div>
        <button
          className="flex items-center gap-1.5 text-left"
          onClick={() => setResourcesOpen(!resourcesOpen)}
        >
          <ChevronRight className={cn("h-3 w-3 shrink-0 transition-transform text-sidebar-foreground/50", resourcesOpen && "rotate-90")} />
          <span className="text-[15px] font-bold text-sidebar-foreground">PM Team Resources</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-sidebar-foreground/50">PRD Tool</span>
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
        {/* View mode switcher — collapses with PM Team Resources */}
        {resourcesOpen && (
          <>
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
                {(["questions-to-client", "questions-from-client"] as const).map((id) => {
                  const page = pages?.find((p) => p.id === id);
                  if (!page) return null;
                  return (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        isActive={viewMode === "wireframe" && activePage === id}
                        onClick={() => { setViewMode("wireframe"); setActivePage(id); }}
                        className="text-xs font-semibold"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <EditableText
                          value={page.label.toLowerCase()}
                          onChange={(v) => renamePage(id, v)}
                          className="text-xs font-semibold"
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />
          </>
        )}

        {/* Page tree — always visible */}
        <>
          {/* Briefings & Strategies — collapsible, separate from website pages */}
          {topLevelPages.filter((p) => p.id === "briefings").map((p) => {
            const children = childrenOf(p.id);
            return (
              <Collapsible key={p.id} open={briefingsOpen} onOpenChange={setBriefingsOpen}>
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-1">
                    <CollapsibleTrigger asChild>
                      <button className="shrink-0 p-0.5 rounded hover:bg-sidebar-accent">
                        <ChevronRight className={cn("h-3 w-3 transition-transform", briefingsOpen && "rotate-90")} />
                      </button>
                    </CollapsibleTrigger>
                    <SidebarMenuButton
                      isActive={activePage === p.id}
                      onClick={() => { setViewMode("wireframe"); setActivePage(p.id); }}
                      className="text-[11px] font-semibold uppercase tracking-wider p-0 h-auto"
                    >
                      {p.label}
                    </SidebarMenuButton>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu>
                      {children.map((ch) => (
                        <SidebarMenuItem key={ch.id}>
                          <SidebarMenuButton
                            isActive={activePage === ch.id}
                            onClick={() => { setViewMode("wireframe"); setActivePage(ch.id); }}
                            className="text-xs"
                          >
                            <span className="flex-1 truncate">
                              <EditableText
                                value={ch.label}
                                onChange={(v) => renamePage(ch.id, v)}
                                className="text-xs"
                              />
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-xs">
                          <a href="/customer-journey.html">
                            <Route className="h-3 w-3 shrink-0" />
                            <span className="flex-1 truncate">Customer Journey Map</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          })}

          <SidebarSeparator />

          {/* Website navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Nav Items</SidebarGroupLabel>
            <SidebarGroupAction title="Add page" onClick={addPage}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
            <SidebarMenu>
              {topLevelPages.filter((p) => p.id !== "briefings" && p.id !== "questions").map((p) => {
                const children = childrenOf(p.id);
                const showDropBefore =
                  dropZone?.pageId === p.id && dropZone.position === "before";
                const showDropAfter =
                  dropZone?.pageId === p.id && dropZone.position === "after";

                return (
                  <SidebarMenuItem
                    key={p.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("page-id", p.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDragPage(p.id);
                    }}
                    onDragOver={(e) => handleDragOver(e, p.id)}
                    onDrop={(e) => handleDrop(e, p.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "relative",
                      overPage === p.id &&
                        "bg-sidebar-primary/15 outline outline-1 outline-sidebar-primary",
                      dragPage === p.id && "opacity-40"
                    )}
                  >
                    {showDropBefore && (
                      <div className="absolute -top-px left-2 right-2 h-0.5 rounded bg-[hsl(41,47%,56%)]" />
                    )}
                    <SidebarMenuButton
                      isActive={activePage === p.id}
                      onClick={() => { setViewMode("wireframe"); setActivePage(p.id); }}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <SidebarMenuAction
                          showOnHover
                          onClick={(e) => e.stopPropagation()}
                          className="text-sidebar-foreground/25 hover:text-red-400"
                          title="Delete page"
                        >
                          <Trash2 className="h-3 w-3" />
                        </SidebarMenuAction>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{p.label}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this page and all its content. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePage(p.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Nested children */}
                    {children.length > 0 && (
                      <SidebarMenuSub>
                        {children.map((ch) => (
                          <SidebarMenuSubItem key={ch.id}>
                            <SidebarMenuSubButton
                              isActive={activePage === ch.id}
                              onClick={() => { setViewMode("wireframe"); setActivePage(ch.id); }}
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
                    {showDropAfter && (
                      <div className="absolute -bottom-px left-2 right-2 h-0.5 rounded bg-[hsl(41,47%,56%)]" />
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

        </>
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
        <StorageIndicator saveStatus={saveStatus} />
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
                This will discard all your edits and restore the original pages. This action
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
