// Shared page layout: sidebar + fixed header + scrollable content
import { useState } from "react";
import Head from "next/head";
import AppSidebar from "./app-sidebar";
import AppHeader from "./app-header";

export default function MainLayout({ title, onAdd, onExport, addLabel, exportLabel, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 60 : 250;

  return (
    <>
      <Head>
        <title>{title} – HUCE</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div style={{ display: "flex", minHeight: "100vh", background: "#fefefe" }}>
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        <div style={{ marginLeft: sidebarWidth, flex: 1, minWidth: 0, transition: "margin-left 0.2s ease" }}>
          <AppHeader
            onAdd={onAdd}
            onExport={onExport}
            sidebarWidth={sidebarWidth}
            pageTitle={title}
            addLabel={addLabel}
            exportLabel={exportLabel}
          />
          <div style={{ padding: 16, paddingTop: 66 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
