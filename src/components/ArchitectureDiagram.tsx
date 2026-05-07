"use client";
import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

export default function ArchitectureDiagram({ data }: { data: any }) {
  // Memoize nodes to fix the console warnings
  const nodes = useMemo(() => data.nodes.map((node: any, index: number) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: index * 220, y: index % 2 === 0 ? 50 : 200 },
    style: { 
      background: '#0f172a', 
      color: '#fff', 
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      padding: '10px',
      width: 160,
      textAlign: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
  })), [data.nodes]);

  const edges = useMemo(() => data.edges.map((edge: any, index: number) => ({
    id: `e${index}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 700 },
    labelBgPadding: [4, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#0f172a', color: '#fff', fillOpacity: 0.7 },
  })), [data.edges]);

  return (
    <div className="h-[500px] w-full rounded-2xl border border-slate-800 bg-slate-900/80 shadow-inner overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#1e293b" gap={20} />
        <Controls className="bg-slate-800 border-slate-700 fill-white" />
        <MiniMap 
          nodeColor="#3b82f6" 
          maskColor="rgba(2, 6, 23, 0.7)" 
          className="bg-slate-900 border border-slate-800 rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}