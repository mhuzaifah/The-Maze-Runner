package com.mhuzaifah.themazerunner;

import java.util.*;
import java.util.List;

public class BFSSolver implements MazeSolver {

    /**
     * Solves the given maze.
     *
     * @param maze Maze to solve
     * @return Path from start to end
     */
    @Override
    public Path solve(Maze maze, Runner runner) {

        Graph mazeGraph = new AdjacencyList();
        mazeGraph.mazeToGraph(maze);
        Path outputPath = new Path();

        Queue<Position> queue = new ArrayDeque<>();
        Map<Position, ArrayList<Position>> pathMap = new HashMap<>();
        Set<Position> visited = new HashSet<>();

        Position start = maze.getStart();
        Position end = maze.getEnd();

        queue.add(start);

        ArrayList<Position> initPath = new ArrayList<>();
        initPath.add(start);
        pathMap.put(start, initPath);

        while(!queue.isEmpty()) {

            Position node = queue.remove();
            ArrayList<Position> path = pathMap.get(node);

            runner.addToRunSequence(node);

            if(node.equals(end)) {
                outputPath = tracePath(path);
                break;
            }

            if(!visited.contains(node)) {
                visited.add(node);
                for(Position neighbour : mazeGraph.getNeighbours(node)) {
                    if(!visited.contains(neighbour)) {
                        queue.add(neighbour);
                        ArrayList<Position> newPath = new ArrayList<>(path);
                        newPath.add(neighbour);
                        pathMap.put(neighbour, newPath);
                    }
                }
            }

        }

        return outputPath;

    }

    /**
     * Tracing the given path from algorithm into a Path object.
     *
     * @param pathBFS List of Positions that the path goes through in order
     * @return Translated path
     */
    private Path tracePath(List<Position> pathBFS) {
        Path path = new Path();
        Direction runnerDirec = Direction.RIGHT;

        Position currNode = pathBFS.get(0);

        for(int i=1; i < pathBFS.size(); i++) {
            Position nextNode = pathBFS.get(i);

            int horizontalMvm = nextNode.x() - currNode.x();
            int verticalMvm = nextNode.y() - currNode.y();

            if(horizontalMvm == 1) {
                if(runnerDirec.equals(Direction.UP)) {
                    path.addStep('R');
                    runnerDirec = runnerDirec.turnRight();
                }
                else if(runnerDirec.equals(Direction.DOWN)) {
                    path.addStep('L');
                    runnerDirec = runnerDirec.turnLeft();
                }
            }
            else if(horizontalMvm == -1) {
                if(runnerDirec.equals(Direction.UP)) {
                    path.addStep('L');
                    runnerDirec = runnerDirec.turnLeft();
                }
                else if(runnerDirec.equals(Direction.DOWN)) {
                    path.addStep('R');
                    runnerDirec = runnerDirec.turnRight();
                }
            }
            else if(verticalMvm == 1) {
                if(runnerDirec.equals(Direction.RIGHT)) {
                    path.addStep('R');
                    runnerDirec = runnerDirec.turnRight();
                }
                else if(runnerDirec.equals(Direction.LEFT)) {
                    path.addStep('L');
                    runnerDirec = runnerDirec.turnLeft();
                }
            }
            else if(verticalMvm == -1) {
                if(runnerDirec.equals(Direction.RIGHT)) {
                    path.addStep('L');
                    runnerDirec = runnerDirec.turnLeft();
                }
                else if(runnerDirec.equals(Direction.LEFT)) {
                    path.addStep('R');
                    runnerDirec = runnerDirec.turnRight();
                }
            }

            path.addStep('F');
            currNode = nextNode;
        }

        return path;

    }

}
