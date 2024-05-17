package com.mhuzaifah.themazerunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdjacencyList implements Graph {

    private Map<Position, List<Position>> adjacencyList;

    AdjacencyList() {
        this.adjacencyList = new HashMap<>();
    }

    /**
     * Turn given maze into a graph.
     *
     * @param maze Maze to turn into graph
     */
    @Override
    public void mazeToGraph(Maze maze) {

        for(int i=0; i < maze.getSizeX(); i++) {
            for(int j=0; j < maze.getSizeY(); j++ ) {
                Position node = new Position(i, j);
                if (!maze.isWall(node)) {
                    adjacencyList.put(node, getNeighbours(node, maze));
                }
            }
        }

    }

    /**
     * Determine the neighbours of a given node in the graph/maze.
     *
     * @param node Node in the graph to get neighbours of
     * @param maze Maze the node is in
     * @return List of neighbours
     */
    private ArrayList<Position> getNeighbours(Position node, Maze maze) {

        ArrayList<Position> neighbours = new ArrayList<>();

        if(node.y() != 0) {
            Position neighbour = node.move(Direction.UP);
            if(!maze.isWall(neighbour))
                neighbours.add(neighbour);
        }

        if(node.y() != maze.getSizeY()-1) {
            Position neighbour = node.move(Direction.DOWN);
            if(!maze.isWall(neighbour))
                neighbours.add(neighbour);
        }

        if(node.x() != 0) {
            Position neighbour = node.move(Direction.LEFT);
            if(!maze.isWall(neighbour))
                neighbours.add(neighbour);
        }

        if(node.x() != maze.getSizeX()-1) {
            Position neighbour = node.move(Direction.RIGHT);
            if(!maze.isWall(neighbour))
                neighbours.add(neighbour);
        }

        return neighbours;

    }

    /**
     * Gets stored neighbours from graph of a node.
     *
     * @param node Node to get neighbours of
     * @return List of neighbours
     */
    public List<Position> getNeighbours(Position node) {
        List<Position> neigbours = adjacencyList.get(node);
        return neigbours;
    }

}
