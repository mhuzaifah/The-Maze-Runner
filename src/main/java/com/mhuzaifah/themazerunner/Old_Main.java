package com.mhuzaifah.themazerunner;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class Old_Main {

    private static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        logger.info("** Starting Maze Runner");
        
        try {
            String filePath = "./examples/tiny.maz.txt";
            BenchMarker benchMarker = new BenchMarker();
            benchMarker.startTimer();
            Maze maze = new Maze(filePath);
            benchMarker.endTimer();
            benchMarker.setTiming("map");

            String method = "tremaux";
            Path path = solveMaze(method, maze);
            System.out.println(path.getFactorizedForm());
        } catch (Exception e) {
            System.err.println("MazeSolver failed.  Reason: " + e.getMessage());
            logger.error("MazeSolver failed.  Reason: " + e.getMessage());
            logger.error("PATH NOT COMPUTED");
        }

        logger.info("End of MazeRunner");
    }

    /**
     * Solve provided maze with specified method.
     *
     * @param method Method to solve maze with
     * @param maze Maze to solve
     * @return Maze solution path
     * @throws Exception If provided method does not exist
     */
    private static Path solveMaze(String method, Maze maze) throws Exception {
        MazeSolver solver = null;
        Runner runner = new Runner();
        switch (method) {
            case "righthand" -> {
                logger.debug("RightHand algorithm chosen.");
                solver = new RightHandSolver();
            }
            case "tremaux" -> {
                logger.debug("Tremaux algorithm chosen.");
                solver = new TremauxSolver();
            }
            case "BFS" -> {
                logger.debug("Breadth First Search algorithm chosen.");
                solver = new BFSSolver();
            }
            case "DFS" -> {
                logger.debug("Depth First Search algorithm chosen.");
                solver = new DFSSolver();
            }
            default -> {
                throw new Exception("Maze solving method '" + method + "' not supported.");
            }
        }

        logger.info("Computing path");
        return solver.solve(maze, runner);
    }


}
