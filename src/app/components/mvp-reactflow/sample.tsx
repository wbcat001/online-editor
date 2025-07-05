import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  ConnectionLineType,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define node types with TypeScript
type NodeData = {
  label: string;
};

// Define initial nodes with proper types
const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Process Node' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 200 },
  },
];

// Define initial edges with proper types
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Connection' },
  { id: 'e2-3', source: '2', target: '3' },
];

function Flow() {
  // Use specialized hooks for better performance
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections with TypeScript types
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => 
        addEdge(
          { 
            ...connection, 
            animated: true,
            style: { stroke: '#2a9d8f' } 
          }, 
          eds
        )
      );
    },
    [setEdges]
  );

  // Add a new node programmatically
  const addNewNode = useCallback(() => {
    const newNode: Node<NodeData> = {
      id: `${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{ type: 'default' }}
        fitView
      >
        <Panel position="top-right">
          <button onClick={addNewNode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Node
          </button>
        </Panel>
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function SampleReactFlow() {
  return (
    <ReactFlowProvider>
      <h1 className="text-xl font-bold mb-4">React Flow Example</h1>
      <Flow />
    </ReactFlowProvider>
  );
}
