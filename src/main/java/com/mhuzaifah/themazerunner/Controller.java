package com.mhuzaifah.themazerunner;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
@RequestMapping("api/")
public class Controller {

    Maze maze;

    @GetMapping("mazerunner")
    public ResponseEntity<List<List<Boolean>>> getMaze(@RequestParam String mazeFile) {
        try {
            String mazeFilePath = "./examples/"+mazeFile;
            maze = new Maze(mazeFilePath);
            return ResponseEntity.ok(maze.getMazeArr());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("mazerunner")
    public Map<String, Object> executeLogic(@RequestBody UserInput initInfo) {
        try {
            Runner runner = new Runner();
            Map<String, Object> response = new HashMap<>();

            if(Objects.equals(initInfo.getMaze(), "custom"))
                maze = new Maze(initInfo.getMazeArr());

            if(initInfo.getMode().equals("solve")) {
                String method = initInfo.getMethod();
                Path path = solveMaze(method, runner, maze);
                response.put("path", path.getFactorizedForm());
                response.put("runnerSeq", runner.getRunSequence());
            } else {
                Path pathForValidation = new Path(initInfo.getPathToVerify());
                if (maze.validatePath(pathForValidation)) {
                    response.put("validity", true);
                } else {
                    response.put("validity", false);
                }
            }
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static Path solveMaze(String method, Runner runner,  Maze maze) throws Exception {
        MazeSolver solver = null;
        switch (method) {
            case "righthand" -> {
                solver = new RightHandSolver();
            }
            case "tremaux" -> {
                solver = new TremauxSolver();
            }
            case "bfs" -> {
                solver = new BFSSolver();
            }
            case "dfs" -> {
                solver = new DFSSolver();
            }
            default -> {
                throw new Exception("Maze solving method '" + method + "' not supported.");
            }
        }
        return solver.solve(maze, runner);
    }

}
