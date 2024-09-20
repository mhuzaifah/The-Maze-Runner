package com.mhuzaifah.themazerunner;

import java.util.List;

public interface Graph {

    /**
     * Convert given maze to a graph.
     *
     * @param maze Maze to convert
     */
    void mazeToGraph(Maze maze);

    /**
     * Determine neighbours of a given node.
     *
     * @param node Given node to find neighbours of
     * @return List of neighbours
     */
    List<Position> getNeighbours(Position node);

}
